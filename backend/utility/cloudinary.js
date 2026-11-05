import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
export const uploadOnCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });
  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(filePath);
    console.log(result);
    fs.unlinkSync(filePath); // Delete the local file after uploading
    return result.secure_url;
  } catch (error) {
    console.error(error);
    fs.unlinkSync(filePath); // Delete the local file after uploading
    return res
      .status(500)
      .json({ message: "Something went wrong while uploading the image" });
  }
};
