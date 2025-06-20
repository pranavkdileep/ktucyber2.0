"use server";
import { sql } from "@/lib/db";
import { UserProfile,Document } from "@/lib/schemas";

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
            COUNT(DISTINCT f1.follower_id) AS total_followers,
            COUNT(DISTINCT f2.following_id) AS total_following,
            COUNT(DISTINCT d.id) FILTER (WHERE d.user_id = u.id) AS total_uploaded_documents,
            COUNT(DISTINCT dl.document_id) AS total_downloaded_documents
        FROM users u
        LEFT JOIN followers f1 ON f1.following_id = u.id
        LEFT JOIN followers f2 ON f2.follower_id = u.id
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
            id: profile.user_id,
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
                d.university_id,
                d.document_type,
                d.file_link,
                d.is_public,
                d.preview_image,
                d.created_at,
                s.name AS subject_name,
                s.slug AS subject_slug,
                s.code AS subject_code,
                un.name AS university_name,
                un.slug AS university_slug
            FROM documents d
            JOIN subjects s ON d.subject_id = s.id
            JOIN universities un ON d.university_id = un.id
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

        const documents: Document[] = result.map(doc => ({
            id: doc.id,
            slug: doc.slug,
            userId: doc.user_id,
            title: doc.title,
            description: doc.description,
            subjectId: doc.subject_id,
            subjectName: doc.subject_name || null,
            subjectSlug: doc.subject_slug || null,
            subjectCode: doc.subject_code || null,
            universityId: doc.university_id,
            universityName: doc.university_name || null,
            universitySlug: doc.university_slug || null,
            documentType: doc.document_type,
            fileKey: doc.file_link,
            isPublic: doc.is_public,
            tags: doc.tags ? doc.tags : [],
            previewImage: doc.preview_image || null,
            createdAt: doc.created_at.toISOString(),
            updatedAt: doc.created_at.toISOString(),
        }));

        return {
            documents: documents,
            totalCount: parseInt(totalCountResult[0].count, 10),
        };
    } catch (error) {
        console.error("Error fetching user uploaded documents:", error);
        return { documents: [], totalCount: 0 };
    }
}

