"use server";
import { sql } from "@/lib/db";
import { UserProfile } from "@/lib/schemas";

export async function getUserProfile(userName: string): Promise<UserProfile | null> {
    try {
        const userProfile = await sql`
            SELECT 
                u.id AS user_id,
                u.username,
                u.first_name AS full_name,
                u.email,
                u.profile_picture,
                u.created_at AS date_of_joining,
                u.user_settings AS user_settings,
                COUNT(DISTINCT f1.user_id) AS total_followers,
                COUNT(DISTINCT f.follower_id) AS total_following,
                COUNT(DISTINCT d.id) FILTER (WHERE d.user_id = u.id) AS total_uploaded_documents,
                COUNT(DISTINCT dl.document_id) AS total_downloaded_documents
            FROM users u
            LEFT JOIN followers f ON f.user_id = u.id
            LEFT JOIN followers f1 ON f1.follower_id = u.id
            LEFT JOIN documents d ON d.user_id = u.id
            LEFT JOIN downloads dl ON dl.document_id = d.id
            WHERE u.username = ${userName}
            GROUP BY u.id;
        `;

        if (userProfile.length === 0) {
            return null;
        }
        const profile = userProfile[0];
        let userSettings;
        if (typeof profile.user_settings === "string") {
            userSettings = JSON.parse(profile.user_settings !== '{}' ? profile.user_settings : '{}') || {};
        } else if (typeof profile.user_settings === "object" && profile.user_settings !== null) {
            userSettings = profile.user_settings;
        } else {
            userSettings = {};
        }
        return {
            theme: userSettings.theme || 'light',
            username: profile.username,
            fullName: profile.full_name || '',
            email: profile.email,
            profilePicture: profile.profile_picture || '',
            dateOfJoining: profile.date_of_joining ? new Date(profile.date_of_joining).toISOString() : '',
            bio: userSettings.bio || '',
            notifications: {
                emailNotifications: userSettings.notifications?.email_notifications || false,
                pushNotifications: userSettings.notifications?.push_notifications || false,
            },
            socialLinks: userSettings.social_links || {},
            totalFollowers: parseInt(profile.total_followers, 10) || 0,
            totalFollowing: parseInt(profile.total_following, 10) || 0,
            totalUploadedDocuments: parseInt(profile.total_uploaded_documents, 10) || 0,
            totalDownloadedDocuments: parseInt(profile.total_downloaded_documents, 10) || 0,
        };
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}

export async function getUserUploadedDocuments(userName: string, pageno: number = 1, pageSize: number = 10): Promise<{ documents: any[], totalCount: number }> {
    try {
        const offset = (pageno - 1) * pageSize;
        const result = await sql`
            SELECT
                d.id,
                d.slug,
                d.title,
                d.description,
                d.subject_id,
                d.cource_id,
                d.semester_id,
                d.university_id,
                d.document_type,
                d.file_link,
                d.is_public,
                d.preview_image,
                d.created_at
            FROM documents d
            JOIN users u ON d.user_id = u.id
            WHERE u.username = ${userName} AND d.is_public = true
            ORDER BY d.created_at DESC
            LIMIT ${pageSize} OFFSET ${offset};
        `;

        const totalCountResult = await sql`
            SELECT COUNT(*) AS count
            FROM documents d
            JOIN users u ON d.user_id = u.id
            WHERE u.username = ${userName} AND d.is_public = true;
        `;
        if (result.length === 0) {
            return { documents: [], totalCount: 0 };
        }
        if (totalCountResult.length === 0) {
            return { documents: [], totalCount: 0 };
        }

        return {
            documents: result.map(doc => ({
                ...doc,
                created_at: doc.created_at.toISOString(),
            })),
            totalCount: parseInt(totalCountResult[0].count, 10),
        };
    } catch (error) {
        console.error("Error fetching user uploaded documents:", error);
        return { documents: [], totalCount: 0 };
    }
}