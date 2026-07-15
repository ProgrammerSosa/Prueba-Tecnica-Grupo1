import { v2 as cloudinary } from 'cloudinary';
import { config } from '../configs/config.js';
import fs from 'fs/promises';
import crypto from 'crypto';
import path from 'path';

// FIX: Bypass SSL (Cloudinary, etc.)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export const uploadImage = async (filePath, fileName) => {
  try {
    const folder = config.cloudinary.folder;
    const options = {
      public_id: fileName,
      folder: folder,
      resource_type: 'image',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    };

    const result = await cloudinary.uploader.upload(filePath, options);

    // Eliminar archivo local después de subir exitosamente
    try {
      await fs.unlink(filePath);
    } catch {
      console.warn('Warning: Could not delete local file:', filePath);
    }

    if (result.error) {
      throw new Error(`Error uploading image: ${result.error.message}`);
    }

    return fileName;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error?.message || error);

    try {
      await fs.unlink(filePath);
    } catch {
      console.warn('Warning: Could not delete local file after upload error');
    }

    throw new Error(
      `Failed to upload image to Cloudinary: ${error?.message || ''}`
    );
  }
};

export const uploadLocalFileToCloudinary = async (filePath, prefix = 'profile') => {
  const ext = path.extname(filePath);
  const randomHex = crypto.randomBytes(6).toString('hex');
  const fileName = `${prefix}-${randomHex}${ext}`;
  try {
    return await uploadImage(filePath, fileName);
  } catch (err) {
    console.error('Error uploading to Cloudinary:', err);
    return null;
  }
};

export const deleteImage = async (imagePath) => {
  try {
    if (!imagePath || imagePath === config.cloudinary.defaultAvatarPath) {
      return true;
    }

    const folder = config.cloudinary.folder;
    const publicId = imagePath.includes('/')
      ? imagePath
      : `${folder}/${imagePath}`;
    const result = await cloudinary.uploader.destroy(publicId);

    return result.result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
};

const isFullUrl = (value) => /^https?:\/\//i.test(value || '');

export const getFullImageUrl = (imagePath) => {
  if (!imagePath) {
    return getDefaultAvatarUrl();
  }

  if (isFullUrl(imagePath)) {
    return imagePath;
  }

  const baseUrl = config.cloudinary.baseUrl;
  const folder = config.cloudinary.folder;
  const pathToUse = imagePath.includes('/') ? imagePath : `${folder}/${imagePath}`;

  return `${baseUrl}${pathToUse}`;
};

export const getDefaultAvatarUrl = () => {
  const defaultPath = config.cloudinary.defaultAvatarPath;
  if (!defaultPath) return '';
  if (isFullUrl(defaultPath)) return defaultPath;
  return `${config.cloudinary.baseUrl}${defaultPath}`;
};

export const getDefaultAvatarPath = () => {
  return config.cloudinary.defaultAvatarPath || '';
};

export default {
  uploadImage,
  uploadLocalFileToCloudinary,
  deleteImage,
  getFullImageUrl,
  getDefaultAvatarUrl,
  getDefaultAvatarPath,
};
