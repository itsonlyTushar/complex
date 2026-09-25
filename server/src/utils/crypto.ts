import crypto from "crypto"

// Restaurants' own payment-provider secrets are stored encrypted (AES-256-GCM), never in plain text.
const getKey = () => {
    const secret = process.env.PAYMENT_SECRETS_KEY
    if (!secret) {
        throw new Error("PAYMENT_SECRETS_KEY is not configured")
    }
    return crypto.createHash("sha256").update(secret).digest()
}

export const encryptSecret = (plain: string) => {
    const iv = crypto.randomBytes(12)
    const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv)
    const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()])
    return [iv, cipher.getAuthTag(), encrypted].map((part) => part.toString("base64")).join(".")
}

export const decryptSecret = (stored: string) => {
    const [iv, tag, encrypted] = stored.split(".").map((part) => Buffer.from(part, "base64"))
    if (!iv || !tag || !encrypted) {
        throw new Error("Stored secret is malformed")
    }
    const decipher = crypto.createDecipheriv("aes-256-gcm", getKey(), iv)
    decipher.setAuthTag(tag)
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8")
}
