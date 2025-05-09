import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    user: null,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginUserStart(state) {
            state.loading = true;
            state.error = null;
        },
        loginUserSuccess(state, action) {
            const { token, role, user } = action.payload;
            state.user = user;
            state.loading = false;

            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            localStorage.setItem("user", JSON.stringify(user));
        },
        loginUserFailure(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
        logoutUser(state) {
            state.user = null;
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user");
        }
    }
});

export const {
    loginUserStart,
    loginUserSuccess,
    loginUserFailure,
    logoutUser
} = authSlice.actions;

export default authSlice.reducer;

export const loginUser = (credentials) => async (dispatch) => {
    dispatch(loginUserStart());
    try {
        const response = await axios.post("http://127.0.0.1:8000/api/login", credentials);
        const { token, role, user } = response.data;
        dispatch(loginUserSuccess({ token, role, user }));
    } catch (error) {
        let errorMessage = "Login failed. Please check your credentials.";
        if (error.response) {
            if (error.response.status === 401) {
                errorMessage = "Invalid credentials.";
            } else if (error.response.status === 403) {
                errorMessage = "You are not authorized.";
            }
        }
        dispatch(loginUserFailure(errorMessage));
    }
};
