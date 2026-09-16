import { v2 as cloudinary } from 'cloudinary';

const rawUrl = process.env.CLOUDINARY_URL || '';
// Deep clean both raw angle brackets < > and url-encoded %3C %3E counterparts
const cleanUrl = rawUrl
  .replace(/[<>]/g, '')
  .replace(/%3C/gi, '')
  .replace(/%3E/gi, '');

if (cleanUrl) {
  // Explicitly parse the cleaned URL to override any cached automatic configurations in the SDK
  const match = cleanUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
  if (match) {
    const [, apiKey, apiSecret, cloudName] = match;
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });
  } else {
    cloudinary.config({
      cloudinary_api_url: cleanUrl
    });
  }
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

export const uploadImageToCloudinary = async (base64Str: string): Promise<string> => {
  if (!base64Str || base64Str.startsWith('http://') || base64Str.startsWith('https://')) {
    return base64Str;
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Str, {
      folder: 'restaurant_menus',
    });
    return uploadResponse.secure_url;
  } catch (error: any) {
    console.error("Cloudinary upload failed:", error);
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

export default cloudinary;
