"use server";
import { sql } from "@/lib/db";
import { Document,University,Subject } from "@/lib/schemas";
import { verifyToken } from "./auth";

export async function uploadDocument(document:Document){
    try{
        const user = await verifyToken();
        if(!user || !user.payload || !user.payload.id){
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
    }catch (error) {
        console.error("Error uploading document:", error);
        throw new Error("Failed to upload document");
    }
}

export async function createUniversity(name: string, imageLink: string, description: string) {
    try {
        const result = await sql`
            INSERT INTO universities (name, image_link, description)
            VALUES (${name}, ${imageLink}, ${description})
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

export async function createSubject(name: string, description: string,code: string) {
    try {
        const result = await sql`
            INSERT INTO subjects (name, description, code)
            VALUES (${name}, ${description}, ${code})
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
            id:row.id,
            name:row.name,
            code:row.code
        }));
        return subjects
    } catch (error) {
        console.error("Error searching subjects:", error);
        throw new Error("Failed to search subjects");
    }
}