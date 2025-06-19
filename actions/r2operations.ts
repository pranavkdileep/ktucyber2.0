"use server";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import sharp from "sharp";

const bucketName = process.env.R2_BUCKET_NAME || "ktucyber";
const publicUrl = process.env.R2_PUBLIC_URL || "";

export async function uploadProfilePicture(
    userId: string,
    file: File,
    currentPictureUrl?: string
): Promise<string> {
    if (!userId || !file) {
        throw new Error("User ID and file are required for upload.");
    }
    if (currentPictureUrl) {
        const currentFileName = currentPictureUrl.replace(publicUrl, "");
        const deleteCommand = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: currentFileName,
        });
        await r2.send(deleteCommand);
    }
    const fileName = `profile-pictures/${userId}/${Date.now()}-${file.name}`;
    const arryBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arryBuffer);
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
        ACL: "public-read",
    });
    const res = await r2.send(command);
    console.log("Upload response:", res);
    return `${publicUrl}${fileName}`;
}

export async function uploadDocumentPreview(
    userId: string,
    file: File
): Promise<string> {
    if (!userId || !file) {
        throw new Error("User ID and file are required for upload.");
    }
    const fileName = `document-previews/${userId}/${Date.now()}-${file.name}`;
    // Resize mazimum to 512x512 pixels
    const arryBuffer = await file.arrayBuffer();
    const buffer = await sharp(Buffer.from(arryBuffer))
        .resize({ width: 512, height: 512, fit: "inside" })
        .toBuffer();
    if (!buffer) {
        throw new Error("Failed to process image buffer.");
    }
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
        ACL: "public-read",
    });
    const res = await r2.send(command);
    console.log("Upload response:", res);
    return `${publicUrl}${fileName}`;
}

export async function uploadUniversityImage(
    universityId: string,
    file: File
): Promise<string> {
    if (!universityId || !file) {
        throw new Error("University ID and file are required for upload.");
    }
    const fileName = `university-images/${universityId}/${Date.now()}-${file.name}`;
    const arryBuffer = await file.arrayBuffer();
    const buffer = await sharp(Buffer.from(arryBuffer))
        .resize({ width: 200, height: 150, fit: "inside" })
        .toBuffer();
    if (!buffer) {
        throw new Error("Failed to process image buffer.");
    }
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
        ACL: "public-read",
    });
    const res = await r2.send(command);
    console.log("Upload response:", res);
    return `${publicUrl}${fileName}`;
}


export async function uploadDocumentFile(
    userId: string,
    file: File,
    documentType: string
): Promise<string> {
    if (!userId || !file) {
        throw new Error("User ID and file are required for upload.");
    }
    const fileName = `documents/${userId}/${Date.now()}-${file.name}`;
    const arryBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arryBuffer);
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
        ACL: "public-read",
    });
    const res = await r2.send(command);
    console.log("Upload response:", res);
    return `${publicUrl}${fileName}`;
}