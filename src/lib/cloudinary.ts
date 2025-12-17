import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  secure: process.env.NODE_ENV === "production",
});

export async function cloudinaryMediaUpload(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise<string | null>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "custom_tech_labs",
        resource_type: "video",
      },
      (err, result) => {
        if (err) {
          console.error(
            `${new Date()}:\nError in media upload\n${err.message}`
          );
          reject(err);
          return;
        }

        resolve(result?.secure_url ?? null);
      }
    );

    stream.end(buffer);
  });
}
