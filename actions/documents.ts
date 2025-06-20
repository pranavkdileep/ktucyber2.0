"use server";
import { sql } from "@/lib/db";
import { Document, University, Subject } from "@/lib/schemas";
import { verifyToken } from "./auth";
import { deleteFile } from "./r2operations";

export async function uploadDocument(document: Document) {
    try {
        const user = await verifyToken();
        if (!user || !user.payload || !user.payload.id) {
            throw new Error("Unauthorized");
        }
        const { id, slug, title, description, subjectId, universityId, documentType, fileKey, isPublic, tags, previewImage } = document;
        const userId = String(user.payload.id);
        const result = await sql`
        INSERT INTO documents (
            id, slug, user_id, title, description, subject_id, university_id, document_type, file_link, is_public, tags, preview_image
        )
        VALUES (
            ${id},
            ${slug},
            ${userId},
            ${title},
            ${description},
            ${subjectId},
            ${universityId},
            ${documentType},
            ${fileKey},
            ${isPublic},
            ${tags ?? null},
            ${previewImage ?? null}
        )
        RETURNING *;
    `;
        if (result.length === 0) {
            throw new Error("Document upload failed");
        }
        return result[0];
    } catch (error) {
        console.error("Error uploading document:", error);
        throw new Error("Failed to upload document");
    }
}

export async function createUniversity(name: string, imageLink: string, description: string,slug: string) {
    if (!name) {
        throw new Error("Name, image link, and description are required");
    }
    if (name.length > 100 || description.length > 500) {
        throw new Error("Name or description exceeds maximum length");
    }
    try {
        const result = await sql`
            INSERT INTO universities (name, image_link, description, slug)
            VALUES (${name}, ${imageLink}, ${description}, ${slug})
            RETURNING *;
        `;
        if (result.length === 0) {
            throw new Error("University creation failed");
        }
        return result[0];
    } catch (error) {
        console.error("Error creating university:", error);
        throw new Error("Failed to create university");
    }
}

export async function createSubject(name: string, description: string, code: string, slug: string) {
    if (!name || !code) {
        throw new Error("Name, description, and code are required");
    }
    try {
        const result = await sql`
            INSERT INTO subjects (name, description, code, slug)
            VALUES (${name}, ${description}, ${code}, ${slug})
            RETURNING *;
        `;
        if (result.length === 0) {
            throw new Error("Subject creation failed");
        }
        return result[0];
    } catch (error) {
        console.error("Error creating subject:", error);
        throw new Error("Failed to create subject");
    }
}

export async function searchUniversities(query: string, limit: number = 10) {
    try {
        const result = await sql`
            SELECT * FROM universities
            WHERE name ILIKE ${`%${query}%`}
            LIMIT ${limit};
        `;
        const universities: University[] = result.map((row: any) => ({
            id: row.id,
            name: row.name,
            slug: row.slug,
            image_link: row.image_link,
            description: row.description,
        }));
        return universities
    } catch (error) {
        console.error("Error searching universities:", error);
        throw new Error("Failed to search universities");
    }
}
export async function searchSubjects(query: string, limit: number = 10) {
    try {
        const result = await sql`
            SELECT * FROM subjects
            WHERE name ILIKE ${`%${query}%`} OR code ILIKE ${`%${query}%`}
            LIMIT ${limit};
        `;
        const subjects: Subject[] = result.map((row: any) => ({
            id: row.id,
            name: row.name,
            code: row.code,
            slug: row.slug
        }));
        return subjects
    } catch (error) {
        console.error("Error searching subjects:", error);
        throw new Error("Failed to search subjects");
    }
}

export async function updateDocument(
    documentId: string,
    title: string,
    description: string,
    isPublic: boolean,
    tags: string[]
) {
    try {
        const user = await verifyToken();
        if (!user || !user.payload || !user.payload.id) {
            throw new Error("Unauthorized");
        }

        const userId = String(user.payload.id);

        // Verify the user owns this document
        const documentCheck = await sql`
        SELECT user_id FROM documents WHERE id = ${documentId}
      `;

        if (documentCheck.length === 0) {
            throw new Error("Document not found");
        }

        if (documentCheck[0].user_id !== userId) {
            throw new Error("Unauthorized to edit this document");
        }

        const result = await sql`
        UPDATE documents 
        SET 
          title = ${title},
          description = ${description},
          is_public = ${isPublic},
          tags = ${tags},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${documentId} AND user_id = ${userId}
        RETURNING *;
      `;

        if (result.length === 0) {
            throw new Error("Document update failed");
        }

        return result[0];
    } catch (error) {
        console.error("Error updating document:", error);
        throw new Error("Failed to update document");
    }
}

export async function deleteDocument(documentId: string) {
    try {
        const user = await verifyToken();
        if (!user || !user.payload || !user.payload.id) {
            throw new Error("Unauthorized");
        }

        const userId = String(user.payload.id);

        // Verify the user owns this document
        const documentCheck = await sql`
        SELECT user_id FROM documents WHERE id = ${documentId}
      `;

        if (documentCheck.length === 0) {
            throw new Error("Document not found");
        }

        if (documentCheck[0].user_id !== userId) {
            throw new Error("Unauthorized to delete this document");
        }
        const documentdata = await sql`
        SELECT * FROM documents WHERE id = ${documentId} AND user_id = ${userId}
      `;
        if (documentdata.length === 0) {
            throw new Error("Document not found or unauthorized");
        }
        // delete the document file and preview image from R2
        if (documentdata[0].file_link) {
            await deleteFile(documentdata[0].file_link);
        }
        if (documentdata[0].preview_image) {
            await deleteFile(documentdata[0].preview_image);
        }

        const result = await sql`
        DELETE FROM documents 
        WHERE id = ${documentId} AND user_id = ${userId}
        RETURNING *;
      `;

        if (result.length === 0) {
            throw new Error("Document deletion failed");
        }

        return result[0];
    } catch (error) {
        console.error("Error deleting document:", error);
        throw new Error("Failed to delete document");
    }
}

export async function setDocumentDownload(documentId: string) {
    try {
        const user = await verifyToken();
        if (!user || !user.payload || !user.payload.id) {
            throw new Error("Unauthorized");
        }

        const userId = String(user.payload.id);

        // Check if the document exists
        const documentCheck = await sql`
        SELECT id FROM documents WHERE id = ${documentId}
      `;

        if (documentCheck.length === 0) {
            throw new Error("Document not found");
        }

        // Insert download record
        const result = await sql`
        INSERT INTO downloads (user_id, document_id)
        VALUES (${userId}, ${documentId})
        RETURNING *;
      `;

        if (result.length === 0) {
            throw new Error("Download record creation failed");
        }

        return result[0];
    } catch (error) {
        console.error("Error setting document download:", error);
        throw new Error("Failed to set document download");
    }
}

export async function setDocumentBookmark(documentId: string) {
    try {
        const user = await verifyToken();
        if (!user || !user.payload || !user.payload.id) {
            throw new Error("Unauthorized");
        }

        const userId = String(user.payload.id);

        // Check if the document exists
        const documentCheck = await sql`
        SELECT id FROM documents WHERE id = ${documentId}
      `;

        if (documentCheck.length === 0) {
            throw new Error("Document not found");
        }

        // Insert bookmark record
        const result = await sql`
        INSERT INTO bookmarks (user_id, document_id)
        VALUES (${userId}, ${documentId})
        RETURNING *;
      `;

        if (result.length === 0) {
            throw new Error("Bookmark record creation failed");
        }

        return result[0];
    } catch (error) {
        console.error("Error setting document bookmark:", error);
        throw new Error("Failed to set document bookmark");
    }
}

export async function removeDocumentBookmark(documentId: string) {
    try {
        const user = await verifyToken();
        if (!user || !user.payload || !user.payload.id) {
            throw new Error("Unauthorized");
        }

        const userId = String(user.payload.id);

        // Check if the bookmark exists
        const bookmarkCheck = await sql`
        SELECT id FROM bookmarks WHERE user_id = ${userId} AND document_id = ${documentId}
      `;

        if (bookmarkCheck.length === 0) {
            throw new Error("Bookmark not found");
        }

        // Delete bookmark record
        const result = await sql`
        DELETE FROM bookmarks 
        WHERE user_id = ${userId} AND document_id = ${documentId}
        RETURNING *;
      `;

        if (result.length === 0) {
            throw new Error("Bookmark deletion failed");
        }

        return result[0];
    } catch (error) {
        console.error("Error removing document bookmark:", error);
        throw new Error("Failed to remove document bookmark");
    }
}

export async function removeDocumentDownload(documentId: string) {
    try {
        const user = await verifyToken();
        if (!user || !user.payload || !user.payload.id) {
            throw new Error("Unauthorized");
        }

        const userId = String(user.payload.id);

        // Check if the download exists
        const downloadCheck = await sql`
        SELECT id FROM downloads WHERE user_id = ${userId} AND document_id = ${documentId}
      `;

        if (downloadCheck.length === 0) {
            throw new Error("Download not found");
        }

        // Delete download record
        const result = await sql`
        DELETE FROM downloads 
        WHERE user_id = ${userId} AND document_id = ${documentId}
        RETURNING *;
      `;

        if (result.length === 0) {
            throw new Error("Download deletion failed");
        }

        return result[0];
    } catch (error) {
        console.error("Error removing document download:", error);
        throw new Error("Failed to remove document download");
    }
}

export async function updateViewCount(documentId: string) {
    try {
        // Increment the view count for the document
        const result = await sql`
        UPDATE documents 
        SET views = views + 1, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${documentId}
        RETURNING *;
      `;

        if (result.length === 0) {
            throw new Error("Document not found or view count update failed");
        }

        return result[0];
    } catch (error) {
        console.error("Error updating document view count:", error);
        throw new Error("Failed to update document view count");
    }
}