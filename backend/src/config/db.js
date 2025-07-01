import {neon} from "@neondatabase/serverless";

import "dotenv/config";

// Create a SQL connection using our DB URL from the .env file
console.log("Connecting with:", process.env.DATABASE_URL);

export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS transactions (
            id          SERIAL PRIMARY KEY,
            user_id     VARCHAR(255) NOT NULL,
            title       VARCHAR(255) NOT NULL,
            amount      DECIMAL(10, 2) NOT NULL,
            category    VARCHAR(255) NOT NULL,
            created_at  DATE NOT NULL DEFAULT CURRENT_DATE
        );
        `;
        // DECIMAL(10,2) means max 10 digits, 2 after the decimal point
        // EXAMPLE: 12345678.90

        console.log("Database initialized successfully");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
}
