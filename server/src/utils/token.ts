import jwt from "jsonwebtoken"

export const generateToken = (payload: object) => {
    return jwt.sign(payload, "SECRET_KEY", { expiresIn: "7d" })
}