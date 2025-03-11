// src/services/cloudinary.ts

/**
 * Uploads a given image file to Cloudinary (unsigned upload).
 * Places the file in the "assets" folder by default.
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const CLOUD_NAME = "dxsttrcsq";
  const UPLOAD_PRESET = "secure_vote";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  // Specify the folder where you want to store images
  formData.append("folder", "assets");
  // e.g., "my-app/assets" if you prefer a nested structure

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  if (!data.secure_url) {
    throw new Error("Cloudinary upload failed");
  }

  return data.secure_url;
}
