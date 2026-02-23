import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import roundsReducer from './slices/roundsSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
    reducer: {
        game: gameReducer,
        rounds: roundsReducer,
        settings: settingsReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;