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