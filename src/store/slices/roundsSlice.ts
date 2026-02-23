import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {Round, Song} from '../../types/game.types';
import { v4 as uuidv4 } from 'uuid';

interface RoundsState {
    rounds: Round[];
}

const initialState: RoundsState = {
    rounds: []
};

export const roundsSlice = createSlice({
    name: 'rounds',
    initialState,
    reducers: {
        addRound: (state) => {
            const newRound: Round = {
                id: uuidv4(),
                roundNumber: state.rounds.length + 1,
                songs: [],
                selectionQuestion: {
                    type: 'alternating',
                    timeLimit: 30
                },
                isCompleted: false
            };
            state.rounds.push(newRound);
        },
        updateRound: (state, action: PayloadAction<Round>) => {
            const index = state.rounds.findIndex(r => r.id === action.payload.id);
            if (index !== -1) {
                state.rounds[index] = action.payload;
            }
        },
        addSongToRound: (state, action: PayloadAction<{ roundId: string; song: Omit<Song, 'id'> }>) => {
            const round = state.rounds.find(r => r.id === action.payload.roundId);
            if (round && round.songs.length < 2) {
                round.songs.push({
                    id: uuidv4(),
                    ...action.payload.song
                });
            }
        },
        removeRound: (state, action: PayloadAction<string>) => {
            state.rounds = state.rounds.filter(r => r.id !== action.payload);
        },
        setRounds: (state, action: PayloadAction<Round[]>) => {
            state.rounds = action.payload;
        }
    }
});

export const {
    addRound,
    updateRound,
    addSongToRound,
    removeRound,
    setRounds
} = roundsSlice.actions;

export default roundsSlice.reducer;