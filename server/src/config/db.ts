import { Pool } from "pg"

export const pool = new Pool({
    user: "postgress",
    host: "localhost",
    database: "mydb",
    password: "myps",
    port: 5432
});
