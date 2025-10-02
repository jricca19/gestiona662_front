import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    lastUpdate: 0,
};

export const postulacionesSlice = createSlice({
    name: "postulaciones",
    initialState,
    reducers: {
        establecerPostulaciones: (state, action) => {
            state.items = action.payload || [];
            state.lastUpdate = Date.now();
        },
        limpiarPostulaciones: (state) => {
            state.items = [];
            state.lastUpdate = Date.now();
        },
        eliminarPostulacion: (state, action) => {
            state.items = state.items.filter(p => p._id !== action.payload);
            state.lastUpdate = Date.now();
        }
    }
});

export const { establecerPostulaciones, limpiarPostulaciones, eliminarPostulacion } = postulacionesSlice.actions;

export default postulacionesSlice.reducer;
