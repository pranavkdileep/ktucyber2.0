"use server";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

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