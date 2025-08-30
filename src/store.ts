import { configureStore } from "@reduxjs/toolkit";
import gameStateReducer from "./features/gameState/gameStateReducer";
import authenticationReducer from "./features/authentication/authenticationReducer";

const store = configureStore({
  reducer: {
    game: gameStateReducer,
    authentication: authenticationReducer,
  },
});

export default store;
