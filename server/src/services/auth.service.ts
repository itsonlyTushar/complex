import { pool } from "../config/db.js"
import { hashPassword } from "../utils/hash.js";
import type { SignupInput } from "../controllers/auth/auth.types.js";

export const signupService = async (data: SignupInput) => {
    const client = await pool.connect();

    try {
        const { restaurantName, location, ownerName, email, password } = data

        const existing = await client.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existing.rows.length > 0) {
            throw new Error("Email already exists");
        }

        await client.query("BEGIN");

        const restaurantRes = await client.query(
            "INSERT INTO restaurants (name, location) values ($1, $2)RETURNING *",
            [restaurantName, location]
        )

        const restaurant = restaurantRes.rows[0];

        const hashedPassword = await hashPassword(password)

        // CREATE USER 
        const userRes = await client.query(
            `INSERT INTO users (name,email,password,role, restaurant_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [ownerName, email, hashedPassword, "vendor", restaurant.id]
        );

        await client.query("COMMIT");

        return userRes.rows[0];

    } catch (error) {
        await client.query("ROLLBACK");
        throw error
    } finally {
        client.release()
    }
}
