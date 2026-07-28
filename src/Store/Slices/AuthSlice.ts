import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../Interfaces/IUser";

interface AuthState {
    token: string | null;
    user: User | null;
}

const initialState: AuthState = {
    token: localStorage.getItem("accessToken"),
    user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")!)
        : null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        insertUserData: (
            state,
            action: PayloadAction<{
                token: string;
                user?: User | null;
            }>
        ) => {
            state.token = action.payload.token;
            state.user = action.payload.user ?? null;

            localStorage.setItem("accessToken", action.payload.token);
            if (action.payload.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(action.payload.user)
                );
            }
        },

        clearUserData: (state) => {
            state.token = null;
            state.user = null;

            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
        },
    },
});

export const { insertUserData, clearUserData } =
    authSlice.actions;

export default authSlice.reducer;