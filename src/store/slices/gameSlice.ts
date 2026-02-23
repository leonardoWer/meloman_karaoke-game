import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {GameState, Team, GamePhase} from '../../types/game.types';
import { v4 as uuidv4 } from 'uuid';

const initialState: GameState = {
    teams: [
        { id: uuidv4(), name: 'Команда 1', score: 0 },
        { id: uuidv4(), name: 'Команда 2', score: 0 }
    ],
    currentRound: 0,
    rounds: [],
    gamePhase: 'setup',
    currentTeamTurn: null,
    winner: null
};

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setTeams: (state, action: PayloadAction<Team[]>) => {
            state.teams = action.payload;
        },
        updateTeamName: (state, action: PayloadAction<{ teamId: string; name: string }>) => {
            const team = state.teams.find(t => t.id === action.payload.teamId);
            if (team) {
                team.name = action.payload.name;
            }
        },
        addScore: (state, action: PayloadAction<{ teamId: string; points: number }>) => {
            const team = state.teams.find(t => t.id === action.payload.teamId);
            if (team) {
                team.score += action.payload.points;
            }
        },
        setGamePhase: (state, action: PayloadAction<GamePhase>) => {
            state.gamePhase = action.payload;
        },
        setCurrentTeamTurn: (state, action: PayloadAction<string>) => {
            state.currentTeamTurn = action.payload;
        },
        nextRound: (state) => {
            if (state.currentRound < state.rounds.length - 1) {
                state.currentRound += 1;
            } else {
                state.gamePhase = 'results';
                // Определяем победителя
                const sortedTeams = [...state.teams].sort((a, b) => b.score - a.score);
                state.winner = sortedTeams[0].id;
            }
        },
        resetGame: () => initialState
    }
});

export const {
    setTeams,
    updateTeamName,
    addScore,
    setGamePhase,
    setCurrentTeamTurn,
    nextRound,
    resetGame
} = gameSlice.actions;

export default gameSlice.reducer;
