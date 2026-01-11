import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from '../utils/jwt.js';
import { ErrorResponse } from '../utils/responseHelper.js';

const prisma = new PrismaClient();

// >>> REGISTER USER
export const register = async (userData) => {
  const { username, password, ...rest } = userData;

  // Cek username
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    throw new ErrorResponse('Username already exists', 400);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Buat user baru
  const newUser = await prisma.user.create({
    data: { username, password: hashedPassword, ...rest },
  });

  return newUser;
};

// >>> LOGIN USER
export const login = async (credentials) => {
  const { username, password } = credentials;

  // Cari user
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new ErrorResponse('Invalid username or password', 401);
  }

  // Cek password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new ErrorResponse('Invalid username or password', 401);
  }

  // Generate token
  const token = jwt.signToken(user.id, 'USER');

  return { user, token };
};

// >>> LOGOUT (placeholder)
export const logout = async () => {
  return { message: 'Logout successful' };
};

// >>> REFRESH TOKEN
export const refreshToken = async (token) => {
  const decoded = jwt.verifyToken(token);

  if (!decoded) {
    throw new ErrorResponse('Invalid token', 401);
  }

  const newToken = jwt.signToken(decoded.id, decoded.role || 'USER');
  return { token: newToken };
};

// >>> RESET PASSWORD (placeholder)
export const resetPassword = async (resetData) => {
  const { reset_token, new_password } = resetData;

  // Tidak ada logic verifikasi token reset
  throw new ErrorResponse('Reset password not implemented yet', 400);
};

// >>> UPDATE PROFILE
export const updateProfile = async (userId, profileData) => {
  await prisma.user.update({
    where: { id: userId },
    data: profileData,
  });

  return { message: 'Profile successfully updated' };
};

// >>> CHANGE PASSWORD
export const changePassword = async (userId, passwords) => {
  const { current_password, new_password } = passwords;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ErrorResponse('User not found', 404);
  }

  const valid = await bcrypt.compare(current_password, user.password);
  if (!valid) {
    throw new ErrorResponse('Current password is incorrect', 400);
  }

  const hashedPassword = await bcrypt.hash(new_password, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: 'Password successfully changed' };
};

// >>> EXPORT DEFAULT
export default {
  register,
  login,
  logout,
  refreshToken,
  resetPassword,
  updateProfile,
  changePassword,
};
