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
        },
        loginUserSuccess(state, action) {
            state.user = action.payload; 
            state.loading = false;

            localStorage.setItem("auth_token", action.payload.token);
            localStorage.setItem("role", action.payload.role);
        },
        loginUserFailure(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
        logoutUser(state) {
            state.user = null;

            localStorage.removeItem("auth_token");
            localStorage.removeItem("role");
        }
    }
});

export const { loginUserStart, loginUserSuccess, loginUserFailure, logoutUser } = authSlice.actions;
export default authSlice.reducer;

export const loginUser = (credentials) => async (dispatch) => {
    dispatch(loginUserStart());
    try {
        const response = await axios.post("http://127.0.0.1:8000/api/login", credentials);

        const { token, role } = response.data;  
        dispatch(loginUserSuccess({ token, role }));
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
