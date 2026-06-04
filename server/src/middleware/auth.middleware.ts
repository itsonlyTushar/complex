import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

interface DecodedToken {
  userId: number;
  role: string;
  email: string;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Get the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Authentication token missing or invalid" });
      return;
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Authentication token missing or invalid format" });
      return;
    }

    // 3. Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any as DecodedToken;

    // 4. Find User in DB (including restaurantId)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    // 5. Attach user to request
    (req as any).user = user;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const optionalAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any as DecodedToken;
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
        });
        if (user) {
          (req as any).user = user;
        }
      }
    }
    next();
  } catch (error) {
    next();
  }
};

