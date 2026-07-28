import axios from "axios";
import type { SignupSchemaType } from "../Utils/Schema/SignupSchema";
import type { LoginSchemaType } from "../Utils/Schema/LoginSchema";
import { baseURL } from "../Constants/BaseUrl";
import type { AuthResponse, LogoutResponse } from "../Interfaces/IUser";

const getHeaders = () => ({
  "Content-Type": "application/json",
  "x-client-user-agent": navigator.userAgent,
});

export const userLogin = async (
  data: LoginSchemaType
): Promise<AuthResponse> => {
  const res = await axios.post<AuthResponse>(
    `${baseURL}/auth/login`,
    data,
    { headers: getHeaders() }
  );

  return res.data;
};

export const userSignup = async (
  data: SignupSchemaType
): Promise<AuthResponse> => {
  const res = await axios.post<AuthResponse>(
    `${baseURL}/auth/signup`,
    data,
    { headers: getHeaders() }
  );

  return res.data;
};

export const userLogout = async (
  token: string
): Promise<LogoutResponse> => {
  const res = await axios.post<LogoutResponse>(
    `${baseURL}/auth/logout`,
    {},
    {
      headers: {
        ...getHeaders(),
        authentication: `bearer ${token}`,
      },
    }
  );

  return res.data;
};