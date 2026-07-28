import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import type { User } from "../../Interfaces/IUser";
import type { Roles } from "../../Types/UserType";

interface AuthState {
    token: string | null;
    user: User | null;
}

const decodeToken = (token: string): User | null => {
    try {
        const { _id, name, email, role } = jwtDecode<{
            _id: string;
            name: string;
            email: string;
            role: string;
        }>(token);
        return { _id, userName: name, email, role: role as Roles } as User;
    } catch {
        return null;
    }
};

const savedToken = localStorage.getItem("accessToken");

const initialState: AuthState = {
    token: savedToken,
    user: savedToken ? decodeToken(savedToken) : null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        insertUserData: (
            state,
            action: PayloadAction<{ token: string; user?: User | null }>
        ) => {
            state.token = action.payload.token;
            state.user = action.payload.user ?? decodeToken(action.payload.token);
            localStorage.setItem("accessToken", action.payload.token);
        },

        clearUserData: (state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem("accessToken");
        },
    },
});

export const { insertUserData, clearUserData } = authSlice.actions;
export default authSlice.reducer;