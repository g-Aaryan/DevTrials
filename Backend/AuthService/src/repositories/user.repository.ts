import { IUser, User } from "../models/user.model";

export const createUser = async (userData: Partial<IUser>) => {
  return await User.create(userData);
};

export const findUserById = async (userId: string) => {
  return await User.findById(userId);
};

export const findUserByEmail = async (email: string) => {
  return await User.findOne({
    email: email.toLowerCase(),
  });
};

export const findUserByEmailWithPassword = async (email: string) => {
  return await User.findOne({
    email: email.toLowerCase(),
  }).select("+password");
};


export const verifyUserEmail = async (userId: string) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      isEmailVerified: true,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};


export const updateUser = async (userId: string,updatedData: Partial<IUser>) => {
  return await User.findByIdAndUpdate(
    userId,
    updatedData,
    {
      new: true,
      runValidators: true,
    }
  );
};


export const deleteUser = async (userId: string) => {
  return await User.findByIdAndDelete(userId);
};