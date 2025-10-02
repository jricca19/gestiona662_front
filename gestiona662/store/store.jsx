import { legacy_createStore as createStore, combineReducers } from "@reduxjs/toolkit";
import usuarioReducer from "./slices/usuarioSlice"
import postulacionesReducer from "./slices/postulacionesSlice"
import publicacionesReducer from "./slices/publicacionesSlice"
import composeWithDevTools from "redux-devtools-expo-dev-plugin";

const rootReducer = combineReducers({
    usuario: usuarioReducer,
    postulaciones: postulacionesReducer,
    publicaciones: publicacionesReducer
});

export const store = createStore(rootReducer, composeWithDevTools());