import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    total: 0,
    lastUpdate: null,
};

export const publicacionesSlice = createSlice({
    name: "publicaciones",
    initialState,
    reducers: {
        establecerTotalPublicaciones: (state, action) => {
            state.total = action.payload || 0;
            state.lastUpdate = Date.now();
        },
        limpiarTotalPublicaciones: (state) => {
            state.total = 0;
            state.lastUpdate = Date.now();
        }
    }
});

export const { establecerTotalPublicaciones, limpiarTotalPublicaciones } = publicacionesSlice.actions;

export default publicacionesSlice.reducer;
