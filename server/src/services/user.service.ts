import { pool } from "../config/db.js"

export const userService = async () => {
    const client = await pool.connect();

    try {
        const data = await client.query(
            "SELECT id, name, email, role, restaurant_id FROM users"
        )
        return data.rows
    } catch (error) {
        console.error(error)
        throw error
    } finally {
        client.release()
    }
}