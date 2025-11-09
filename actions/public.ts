"use server";
import { sql } from "@/lib/db";
import { UserProfile, Document, Subject, SubjectPublicDocument ,DocumentViewPage} from "@/lib/schemas";

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

export async function getSubjectBySlug(subjectSlug: string): Promise<Subject> {
    try {
        const subject = await sql`
            SELECT 
                id, 
                name, 
                slug, 
                description, 
                code, 
                created_at, 
                updated_at
            FROM subjects
            WHERE slug = ${subjectSlug}
        `;

        if (subject.length === 0) {
            throw new Error(`Subject with slug ${subjectSlug} not found`);
        }

        const sub = subject[0];
        return {
            id: sub.id,
            name: sub.name,
            slug: sub.slug,
            description: sub.description || '',
            code: sub.code || ''
        };
    } catch (error) {
        console.error("Error fetching subject by slug:", error);
        throw new Error(`Failed to fetch subject: ${error}`);
    }
}

export async function getSubjectDocuments(subjectSlug: string, searchQuery: string | null, pageno: number = 1, pageSize: number = 10): Promise<{ documents: SubjectPublicDocument[], totalCount: number }> {
    try {
        const offset = (pageno - 1) * pageSize;
        if (searchQuery && searchQuery.trim() !== '') {
            searchQuery = `%${searchQuery}%`;
        }
        const result = await sql`
            SELECT
                d.id,
                d.slug,
                d.user_id AS userId,
                d.title,
                d.description,
                d.created_at,
                d.subject_id AS subjectId,
                s.name AS subjectName,
                s.slug AS subjectSlug,
                s.code AS subjectCode,
                d.university_id AS universityId,
                un.name AS universityName,
                un.slug AS universitySlug,
                d.document_type AS documentType,
                d.file_link AS fileKey,
                d.tags,
                d.preview_image AS previewImage,
                u.username
            FROM documents d
            JOIN subjects s ON d.subject_id = s.id
            JOIN universities un ON d.university_id = un.id
            JOIN users u ON d.user_id = u.id
            WHERE s.slug = ${subjectSlug} AND d.is_public = true
            ${searchQuery ? sql`AND (d.title ILIKE ${searchQuery} OR d.description ILIKE ${searchQuery})` : sql``}
            ORDER BY d.created_at DESC
            LIMIT ${pageSize} OFFSET ${offset};
        `;
        const totalCountResult = await sql`
            SELECT COUNT(*) AS count
            FROM documents d
            JOIN subjects s ON d.subject_id = s.id
            WHERE s.slug = ${subjectSlug} AND d.is_public = true
            ${searchQuery ? sql`AND (d.title ILIKE ${searchQuery} OR d.description ILIKE ${searchQuery})` : sql``};
        `;
        if (result.length === 0) {
            return { documents: [], totalCount: 0 };
        }
        if (totalCountResult.length === 0) {
            return { documents: [], totalCount: 0 };
        }
        const documents: SubjectPublicDocument[] = result.map(doc => ({
            id: doc.id,
            slug: doc.slug,
            userId: doc.userId,
            title: doc.title,
            description: doc.description,
            subjectId: doc.subjectId,
            subjectName: doc.subjectName || null,
            subjectSlug: doc.subjectSlug || null,
            subjectCode: doc.subjectCode || null,
            universityId: doc.universityId,
            universityName: doc.universityName || null,
            universitySlug: doc.universitySlug || null,
            documentType: doc.documentType as 'pdf' | 'docx' | 'pptx' | 'xlsx',
            fileKey: doc.fileKey,
            tags: doc.tags ? doc.tags : [],
            previewImage: doc.previewimage || null,
            username: doc.username,
            createdAt: doc.created_at.toISOString(),
        }));
        return {
            documents: documents,
            totalCount: parseInt(totalCountResult[0].count, 10),
        };
    } catch (error) {
        console.error("Error fetching subject documents:", error);
        return { documents: [], totalCount: 0 };
    }
}

export async function getDocumentViewPage(slug: string, userId?: string): Promise<DocumentViewPage | null> {
    try {
        // Fetch document and related info
        const docResult = await sql`
            SELECT
                d.id,
                d.slug,
                d.user_id,
                d.title,
                d.description,
                d.subject_id,
                d.university_id,
                d.document_type,
                d.file_link,
                d.is_public,
                d.tags,
                d.preview_image,
                d.views,
                d.created_at,
                d.updated_at,
                u.username,
                u.first_name,
                u.profile_picture,
                u.user_settings,
                s.name AS subject_name,
                s.slug AS subject_slug,
                s.code AS subject_code,
                s.description AS subject_description,
                un.name AS university_name,
                un.slug AS university_slug,
                un.image_link AS university_image_link,
                un.description AS university_description
            FROM documents d
            JOIN users u ON d.user_id = u.id
            JOIN subjects s ON d.subject_id = s.id
            JOIN universities un ON d.university_id = un.id
            WHERE d.slug = ${slug} AND d.is_public = true
            LIMIT 1;
        `;

        if (docResult.length === 0) {
            return null;
        }

        const doc = docResult[0];

        // Parse user settings for bio and social links
        let userSettings: any = {};
        if (typeof doc.user_settings === "string") {
            userSettings = JSON.parse(doc.user_settings !== '{}' ? doc.user_settings : '{}') || {};
        } else if (typeof doc.user_settings === "object" && doc.user_settings !== null) {
            userSettings = doc.user_settings;
        }

        // Get user stats
        const statsResult = await sql`
            SELECT
                (SELECT COUNT(*) FROM followers WHERE following_id = ${doc.user_id}) AS total_followers,
                (SELECT COUNT(*) FROM followers WHERE follower_id = ${doc.user_id}) AS total_following,
                (SELECT COUNT(*) FROM documents WHERE user_id = ${doc.user_id}) AS total_uploaded_documents,
                (SELECT COUNT(*) FROM downloads WHERE user_id = ${doc.user_id}) AS total_downloaded_documents
        `;
        const stats = statsResult[0];

        // Check if bookmarked/downloaded by this user (if userId provided)
        let isBookmarked = false;
        let isDownloaded = false;
        if (userId) {
            const [bookmarkResult, downloadResult] = await Promise.all([
                sql`SELECT 1 FROM bookmarks WHERE user_id = ${userId} AND document_id = ${doc.id} LIMIT 1;`,
                sql`SELECT 1 FROM downloads WHERE user_id = ${userId} AND document_id = ${doc.id} LIMIT 1;`
            ]);
            isBookmarked = bookmarkResult.length > 0;
            isDownloaded = downloadResult.length > 0;
        }

        return {
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
            tags: doc.tags ? doc.tags : [],
            previewImage: doc.preview_image || null,
            views: doc.views || 0,
            username: doc.username,
            createdAt: doc.created_at instanceof Date ? doc.created_at : new Date(doc.created_at),
            updatedAt: doc.updated_at instanceof Date ? doc.updated_at : new Date(doc.updated_at),
            isBookmarked,
            isDownloaded,
            userProfile: {
                id: doc.user_id,
                username: doc.username,
                fullName: doc.first_name || '',
                profilePicture: doc.profile_picture || '',
                bio: userSettings.bio || '',
                socialLinks: userSettings.social_links || {},
                totalFollowers: parseInt(stats.total_followers, 10) || 0,
                totalFollowing: parseInt(stats.total_following, 10) || 0,
                totalUploadedDocuments: parseInt(stats.total_uploaded_documents, 10) || 0,
                totalDownloadedDocuments: parseInt(stats.total_downloaded_documents, 10) || 0,
            },
            university: {
                id: doc.university_id,
                name: doc.university_name,
                slug: doc.university_slug,
                image_link: doc.university_image_link || undefined,
                description: doc.university_description || undefined,
            },
            subject: {
                id: doc.subject_id,
                name: doc.subject_name,
                slug: doc.subject_slug,
                code: doc.subject_code,
                description: doc.subject_description || undefined,
            }
        };
    } catch (error) {
        console.error("Error fetching document view page:", error);
        return null;
    }
}

export async function getRecentDocuments(limit: number = 10): Promise<{previewImage: string, name: string, slug: string}[]> {
    try {
        const result = await sql`
            SELECT 
                d.slug, 
                d.title AS name, 
                s.slug AS subjectslug,
                d.preview_image AS previewImage
            FROM documents d
            JOIN subjects s ON d.subject_id = s.id
            WHERE d.is_public = true
            ORDER BY d.created_at DESC
            LIMIT ${limit};
        `;

        if (result.length === 0) {
            return [];
        }
        console.log("Recent documents fetched:", result);

        return result.map(doc => ({
            slug: `/${doc.subjectslug}/${doc.slug}`,
            name: doc.name,
            previewImage: doc.previewimage || '/placeholder.svg?height=150&width=150&query=document'
        }));
    } catch (error) {
        console.error("Error fetching recent documents:", error);
        return [];
    }
}

export async function getTrendingSubjects(limit: number = 6): Promise<{name: string, slug: string, imageUrl: string}[]> {
    try {
        const result = await sql`
            SELECT 
                s.name, 
                s.slug, 
                COUNT(d.id) AS document_count
            FROM subjects s
            LEFT JOIN documents d ON s.id = d.subject_id AND d.is_public = true
            GROUP BY s.id
            ORDER BY document_count DESC
            LIMIT ${limit};
        `;

        if (result.length === 0) {
            return [];
        }

        return result.map(sub => ({
            name: sub.name,
            slug: sub.slug,
            imageUrl: `/placeholder.svg?height=150&width=150&query=${encodeURIComponent(sub.name)} subject`
        }));
    } catch (error) {
        console.error("Error fetching trending subjects:", error);
        return [];
    }
}