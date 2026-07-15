import { findUserById, updateProfilePicture } from './user-db.js';
import { buildUserResponse } from '../utils/user-helpers.js';
import {
  uploadLocalFileToCloudinary,
  deleteImage,
} from './cloudinary-service.js';

export const getUserProfileHelper = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }
  return buildUserResponse(user);
};

export const updateUserProfilePictureHelper = async (userId, filePath) => {
  const currentUser = await findUserById(userId);
  if (!currentUser) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }

  const newProfilePicture = await uploadLocalFileToCloudinary(
    filePath,
    'profile'
  );
  if (!newProfilePicture) {
    const err = new Error('No se pudo procesar la imagen');
    err.status = 502;
    throw err;
  }

  const oldPicture = currentUser.UserProfile?.ProfilePicture;
  const updatedUser = await updateProfilePicture(userId, newProfilePicture);
  if (oldPicture) await deleteImage(oldPicture);

  return buildUserResponse(updatedUser);
};
