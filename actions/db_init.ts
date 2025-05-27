import { sql } from "@/lib/db";

async function dbInit() {
    try{
        // Create The users table if it doesn't exist
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY,
                email VARCHAR(100) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                first_name VARCHAR(50),
                last_name VARCHAR(50),
                password_hash TEXT NOT NULL,
                username VARCHAR(50) UNIQUE NOT NULL,
                user_role VARCHAR(20) DEFAULT 'user',
                is_active BOOLEAN DEFAULT TRUE,
                is_verified BOOLEAN DEFAULT FALSE,
                verification_token_jwt TEXT,
                profile_picture VARCHAR(255),
                password_reset_token_jwt TEXT
            );
        `;
    console.log("Database initialized successfully.");
    }catch (error) {
        console.error("Database initialization failed:", error);
    }
}

dbInit().catch(console.error);