'use server';
import { UserProfile } from "@/lib/schemas";
import { sql } from "@/lib/db";


export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
        const userProfile = await sql`
            SELECT 
                u.id AS user_id,
                u.username,
                u.first_name AS full_name,
                u.email,
                u.profile_picture,
                u.created_at AS date_of_joining,
                u.user_settings->>'bio' AS bio,
                u.user_settings->'social_links' AS social_links,
                u.user_settings->'notifications' AS notifications,
                u.user_settings->>'theme' AS theme,
                COUNT(DISTINCT f1.user_id) AS total_followers,
                COUNT(DISTINCT f.follower_id) AS total_following,
                COUNT(DISTINCT d.id) FILTER (WHERE d.user_id = u.id) AS total_uploaded_documents,
                COUNT(DISTINCT dl.document_id) AS total_downloaded_documents
            FROM users u
            LEFT JOIN followers f ON f.user_id = u.id
            LEFT JOIN followers f1 ON f1.follower_id = u.id
            LEFT JOIN documents d ON d.user_id = u.id
            LEFT JOIN downloads dl ON dl.document_id = d.id
            WHERE u.id = ${userId}
            GROUP BY u.id;
        `;

        if (userProfile.length === 0) {
            return null;
        }
        const profile = userProfile[0];
        return {
            theme: profile.theme || 'light',
            username: profile.username,
            fullName: profile.full_name || '',
            email: profile.email,
            profilePicture: profile.profile_picture || '',
            dateOfJoining: profile.date_of_joining ? new Date(profile.date_of_joining).toISOString() : '',
            bio: profile.bio || '',
            notifications: {
                emailNotifications: profile.notifications?.email_notifications || false,
                pushNotifications: profile.notifications?.push_notifications || false,
            },
            socialLinks: profile.social_links || {},
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

export async function updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<boolean> {
    try {
        const { theme, username, fullName, email, profilePicture, bio, socialLinks, notifications } = profileData;

        await sql`
            UPDATE users
            SET 
                user_settings = jsonb_set(
                    user_settings,
                    '{theme}',
                    ${theme ? JSON.stringify(theme) : '"light"'},
                    true
                ) || jsonb_set(
                    user_settings,
                    '{username}',
                    ${username ? JSON.stringify(username) : 'null'},
                    true
                ) || jsonb_set(
                    user_settings,
                    '{full_name}',
                    ${fullName ? JSON.stringify(fullName) : 'null'},
                    true
                ) || jsonb_set(
                    user_settings,
                    '{email}',
                    ${email ? JSON.stringify(email) : 'null'},
                    true
                ) || jsonb_set(
                    user_settings,
                    '{profile_picture}',
                    ${profilePicture ? JSON.stringify(profilePicture) : 'null'},
                    true
                ) || jsonb_set(
                    user_settings,
                    '{bio}',
                    ${bio ? JSON.stringify(bio) : 'null'},
                    true
                ) || jsonb_set(
                    user_settings,
                    '{social_links}',
                    ${socialLinks ? JSON.stringify(socialLinks) : '{}' },
                    true
                ) || jsonb_set(
                    user_settings,
                    '{notifications}',
                    ${notifications ? JSON.stringify(notifications) : '{}' },
                    true
                )
            WHERE id = ${userId};
        `;

        return true;
    } catch (error) {
        console.error("Error updating user profile:", error);
        return false;
    }
}
export async function deleteUserProfile(userId: string): Promise<boolean> {
    try {
        // Delete user profile
        await sql`
            DELETE FROM users
            WHERE id = ${userId};
        `;

        // Optionally, delete related data like documents, followers, etc.
        await sql`
            DELETE FROM documents
            WHERE user_id = ${userId};
        `;
        await sql`
            DELETE FROM followers
            WHERE following_id = ${userId} OR follower_id = ${userId};
        `;
        await sql`
            DELETE FROM document_downloads
            WHERE user_id = ${userId};
        `;

        return true;
    } catch (error) {
        console.error("Error deleting user profile:", error);
        return false;
    }
}

export async function getUserUploadedDocuments(userId: string,pageno: number = 1, pageSize: number = 10): Promise<{ documents: any[], totalCount: number }> {
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
            WHERE d.user_id = ${userId}
            ORDER BY d.created_at DESC
            LIMIT ${pageSize} OFFSET ${offset};
        `;

        const totalCountResult = await sql`
            SELECT COUNT(*) AS count
            FROM documents
            WHERE user_id = ${userId};
        `;
        
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
export async function getUserDownloadedDocuments(userId: string, pageno: number = 1, pageSize: number = 10): Promise<{ documents: any[], totalCount: number }> {
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
            JOIN downloads dd ON dd.document_id = d.id
            WHERE dd.user_id = ${userId}
            ORDER BY dd.created_at DESC
            LIMIT ${pageSize} OFFSET ${offset};
        `;

        const totalCountResult = await sql`
            SELECT COUNT(*) AS count
            FROM downloads
            WHERE user_id = ${userId};
        `;
        
        return {
            documents: result.map(doc => ({
                ...doc,
                created_at: doc.created_at.toISOString(),
            })),
            totalCount: parseInt(totalCountResult[0].count, 10),
        };
    } catch (error) {
        console.error("Error fetching user downloaded documents:", error);
        return { documents: [], totalCount: 0 };
    }
}

export async function getUserBookmarks(userId: string, pageno: number = 1, pageSize: number = 10): Promise<{ documents: any[], totalCount: number }> {
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
            JOIN bookmarks b ON b.document_id = d.id
            WHERE b.user_id = ${userId}
            ORDER BY b.created_at DESC
            LIMIT ${pageSize} OFFSET ${offset};
        `;

        const totalCountResult = await sql`
            SELECT COUNT(*) AS count
            FROM bookmarks
            WHERE user_id = ${userId};
        `;
        
        return {
            documents: result.map(doc => ({
                ...doc,
                created_at: doc.created_at.toISOString(),
            })),
            totalCount: parseInt(totalCountResult[0].count, 10),
        };
    } catch (error) {
        console.error("Error fetching user bookmarks:", error);
        return { documents: [], totalCount: 0 };
    }
}
export async function getUserFollowers(userId: string, pageno: number = 1, pageSize: number = 10): Promise<{ followers: any[], totalCount: number }> {
    try {
        const offset = (pageno - 1) * pageSize;

        const result = await sql`
            SELECT 
                u.id,
                u.username,
                u.first_name AS full_name,
                u.profile_picture,
                f.created_at
            FROM followers f
            JOIN users u ON u.id = f.follower_id
            WHERE f.following_id = ${userId}
            ORDER BY f.created_at DESC
            LIMIT ${pageSize} OFFSET ${offset};
        `;

        const totalCountResult = await sql`
            SELECT COUNT(*) AS count
            FROM followers
            WHERE following_id = ${userId};
        `;
        
        return {
            followers: result.map(follower => ({
                ...follower,
                created_at: follower.created_at.toISOString(),
            })),
            totalCount: parseInt(totalCountResult[0].count, 10),
        };
    } catch (error) {
        console.error("Error fetching user followers:", error);
        return { followers: [], totalCount: 0 };
    }
}
export async function getUserFollowing(userId: string, pageno: number = 1, pageSize: number = 10): Promise<{ following: any[], totalCount: number }> {
    try {
        const offset = (pageno - 1) * pageSize;

        const result = await sql`
            SELECT 
                u.id,
                u.username,
                u.first_name AS full_name,
                u.profile_picture,
                f.created_at
            FROM followers f
            JOIN users u ON u.id = f.following_id
            WHERE f.follower_id = ${userId}
            ORDER BY f.created_at DESC
            LIMIT ${pageSize} OFFSET ${offset};
        `;

        const totalCountResult = await sql`
            SELECT COUNT(*) AS count
            FROM followers
            WHERE follower_id = ${userId};
        `;
        
        return {
            following: result.map(following => ({
                ...following,
                created_at: following.created_at.toISOString(),
            })),
            totalCount: parseInt(totalCountResult[0].count, 10),
        };
    } catch (error) {
        console.error("Error fetching user following:", error);
        return { following: [], totalCount: 0 };
    }
}
export async function getUserNotifications(userId: string, pageno: number = 1, pageSize: number = 10): Promise<{ notifications: any[], totalCount: number }> {
    try {
        const offset = (pageno - 1) * pageSize;

        const result = await sql`
            SELECT 
                n.id,
                n.type,
                n.message,
                n.is_read,
                n.created_at
            FROM notifications n
            WHERE n.user_id = ${userId}
            ORDER BY n.created_at DESC
            LIMIT ${pageSize} OFFSET ${offset};
        `;

        const totalCountResult = await sql`
            SELECT COUNT(*) AS count
            FROM notifications
            WHERE user_id = ${userId};
        `;
        
        return {
            notifications: result.map(notification => ({
                ...notification,
                created_at: notification.created_at.toISOString(),
            })),
            totalCount: parseInt(totalCountResult[0].count, 10),
        };
    } catch (error) {
        console.error("Error fetching user notifications:", error);
        return { notifications: [], totalCount: 0 };
    }
}