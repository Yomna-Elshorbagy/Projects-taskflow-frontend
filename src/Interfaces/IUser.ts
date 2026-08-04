import type { Gender, Roles, Status } from "../Types/UserType";

export interface SignupData {
  userName: string;
  email: string;
  password: string;
  Cpassword: string;
  gender: Gender;
  mobileNumber: string;
  recoveryEmail?: string;
}

export interface LoginData {
  email?: string;
  mobileNumber?: string;
  password: string;
}

export interface User {
  _id: string;
  userName: string;
  email: string;
  gender: Gender;
  mobileNumber: string;
  role: Roles;
  status: Status;
  isVerified: boolean;
  address?: string;
  image?: {
    secure_url: string;
    public_id: string;
  };
}

export interface AuthResponse {
  message: string;
  success: boolean;
  accessToken: string;
  data?: User;
}

export interface LogoutResponse {
  message: string;
  success: boolean;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
}

export interface UpdateProfileData {
  userName?: string;
  mobileNumber?: string;
  address?: string;
  gender?: Gender;
}

export interface ProfileResponse {
  success: boolean;
  message?: string;
  data: User;
}