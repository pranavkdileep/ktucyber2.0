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
                password_reset_token_jwt TEXT,
                user_settings JSONB DEFAULT '{}'
            );
        `;
        // Create Documents table if it doesn't exist
        await sql`
            CREATE TABLE IF NOT EXISTS documents (
                id UUID PRIMARY KEY,
                slug VARCHAR(255) UNIQUE NOT NULL,
                user_id UUID NOT NULL REFERENCES users(id),
                title VARCHAR(255) NOT NULL,
                description TEXT,
                subject_id UUID NOT NULL,
                cource_id UUID NOT NULL,
                semester_id UUID NOT NULL,
                university_id UUID NOT NULL,
                document_type VARCHAR(50) NOT NULL,
                file_link TEXT NOT NULL,
                is_public BOOLEAN DEFAULT TRUE,
                tags TEXT[],
                preview_image TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        // Create Subjects table if it doesn't exist
        await sql`
            CREATE TABLE IF NOT EXISTS subjects (
                id UUID PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        // Create Courses table if it doesn't exist
        await sql`
            CREATE TABLE IF NOT EXISTS courses (
                id UUID PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        // Create Universities table if it doesn't exist
        await sql`
            CREATE TABLE IF NOT EXISTS universities (
                id UUID PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        // Create Bookmarks table if it doesn't exist
        await sql`
            CREATE TABLE IF NOT EXISTS bookmarks (
                id UUID PRIMARY KEY,
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        // Create Downloads table if it doesn't exist
        await sql`
            CREATE TABLE IF NOT EXISTS downloads (
                id UUID PRIMARY KEY,
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        // Create Followers table if it doesn't exist
        await sql`
            CREATE TABLE IF NOT EXISTS followers (
                id UUID PRIMARY KEY,
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        // Create Notifications table if it doesn't exist
        await sql`
            CREATE TABLE IF NOT EXISTS notifications (
                id UUID PRIMARY KEY,
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                type VARCHAR(50) NOT NULL,
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

    console.log("Database initialized successfully.");
    }catch (error) {
        console.error("Database initialization failed:", error);
    }
}

dbInit().catch(console.error);