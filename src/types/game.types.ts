export interface Team {
    id: string;
    name: string;
    score: number;
}

export interface Song {
    id: string;
    title: string;
    videoUrl: string;
    correctAnswers: string[];
}

export interface Round {
    id: string;
    roundNumber: number;
    songs: Song[]; // 2 песни на выбор
    selectionQuestion: {
        type: 'alternating' | 'custom';
        topic?: string;
        timeLimit: number; // в секундах
    };
    isCompleted: boolean;
    winningTeamId?: string;
    selectedSongId?: string;
}

export interface GameState {
    teams: Team[];
    currentRound: number;
    rounds: Round[];
    gamePhase: GamePhase;
    currentTeamTurn: string | null; // ID команды, которая сейчас выбирает
    winner: string | null;
}

export type GamePhase =
    | 'setup'
    | 'selection-question'
    | 'song-selection'
    | 'watching-video'
    | 'showing-answers'
    | 'results';

export interface SoundSettings {
    transitionSound: string; // URL или путь к файлу
    thinkingMusic: string;
    countdownSound: string;
    volume: number;
}
