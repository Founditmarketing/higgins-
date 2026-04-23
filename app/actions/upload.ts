"use server";

import { put } from '@vercel/blob';
import crypto from "crypto";

export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) {
    return { success: false, error: "No file provided" };
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { success: false, error: "Vercel Blob is not connected. Please create Blob storage in Vercel." };
  }

  try {
    const uniqueSuffix = crypto.randomBytes(4).toString("hex");
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${uniqueSuffix}-${originalName}`;
    
    // Upload to Vercel Blob
    const blob = await put(filename, file, { access: 'public' });

    // Return the public URL provided by Vercel Blob
    return { success: true, url: blob.url };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Failed to upload file to Vercel Blob" };
  }
}
