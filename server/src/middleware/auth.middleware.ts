import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

export type UserRole = "SUPER_ADMIN" | "FOOD_COURT_ADMIN" | "RESTAURANT_VENDOR";

export interface AuthenticatedUser {
  id: number;
  role: UserRole;
  email: string;
  foodCourtId: string | null;
  restaurantId: string | null;
}

interface DecodedToken {
  userId: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

const getUserFromToken = async (token: string): Promise<AuthenticatedUser | null> => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  const decoded = jwt.verify(token, secret);
  if (typeof decoded === "string" || typeof decoded.userId !== "number" || !Number.isInteger(decoded.userId)) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      role: true,
      email: true,
      foodCourtId: true,
      restaurantId: true,
    },
  });
};

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Authentication token missing or invalid" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Authentication token missing or invalid format" });
      return;
    }

    const user = await getUserFromToken(token);

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    if (error instanceof Error && error.message === "JWT_SECRET is not configured.") {
      res.status(500).json({ message: "Authentication is not configured on the server." });
      return;
    }
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const optionalAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (token) {
        const user = await getUserFromToken(token);
        if (user) {
          req.user = user;
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const canAccessRole = (user: AuthenticatedUser | undefined, roles: UserRole[]) =>
  !!user && roles.includes(user.role);

export const requireRole = (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!canAccessRole(req.user, roles)) {
      res.status(403).json({ message: "You do not have permission to perform this action." });
      return;
    }
    next();
  };
