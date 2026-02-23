import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type {SoundSettings} from '../../types/sound.types';

export interface GameSettings {
    numberOfRounds: number;
    teams: {
        id: string;
        name: string;
    }[];
    selectionTimeLimit: number;
}

interface SettingsState {
    sound: SoundSettings;
    game: GameSettings;
    isLoading: boolean;
    error: string | null;
}

// Базовые пути для звуков
const SOUNDS_BASE_PATH = '/sounds';

// Начальное состояние с путями к дефолтным звукам
const initialState: SettingsState = {
    sound: {
        switchToSound: `${SOUNDS_BASE_PATH}/default/switch_to.mp3`,
        transitionMusic: `${SOUNDS_BASE_PATH}/default/transition.mp3`,
        thinkingMusic: `${SOUNDS_BASE_PATH}/default/thinking.mp3`,
        timerEndSound: `${SOUNDS_BASE_PATH}/default/timer_end.mp3`,
        volume: 0.7
    },
    game: {
        numberOfRounds: 1,
        teams: [
            { id: uuidv4(), name: 'Команда 1' },
            { id: uuidv4(), name: 'Команда 2' }
        ],
        selectionTimeLimit: 20
    },
    isLoading: false,
    error: null
};

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        updateSoundSettings: (state, action: PayloadAction<Partial<SoundSettings>>) => {
            state.sound = { ...state.sound, ...action.payload };
        },

        updateGameSettings: (state, action: PayloadAction<Partial<GameSettings>>) => {
            state.game = { ...state.game, ...action.payload };
        },

        updateTeamName: (state, action: PayloadAction<{ teamId: string; name: string }>) => {
            const team = state.game.teams.find(t => t.id === action.payload.teamId);
            if (team) {
                team.name = action.payload.name;
            }
        },

        resetSettings: (state) => {
            state.sound = initialState.sound;
            state.game = initialState.game;
        },

        loadSettings: (_state, action: PayloadAction<SettingsState>) => {
            return action.payload;
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    }
});

export const {
    updateSoundSettings,
    updateGameSettings,
    updateTeamName,
    resetSettings,
    loadSettings,
    setLoading,
    setError
} = settingsSlice.actions;

export default settingsSlice.reducer;