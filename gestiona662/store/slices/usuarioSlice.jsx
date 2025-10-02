import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    logueado: false,
    name: "",
    lastName: "",
    email: "",
    role: "",
    ci: "",
    phoneNumber: "",
};

export const usuarioSlice = createSlice({
    name: "usuario",
    initialState,
    reducers: {
        loguear: (state, action) => {
            state.logueado = true;
            if (action.payload) {
                state.name = action.payload.name || "";
                state.lastName = action.payload.lastName || "";
                state.email = action.payload.email || "";
                state.role = action.payload.role || "";
                state.ci = action.payload.ci || "";
                state.phoneNumber = action.payload.phoneNumber || "";
            }
        },
        desloguear: (state) => {
            state.logueado = false;
            state.name = "";
            state.lastName = "";
            state.email = "";
            state.role = "";
            state.ci = "";
            state.phoneNumber = "";
        }
    }
});

export const { loguear, desloguear } = usuarioSlice.actions;

export default usuarioSlice.reducer;