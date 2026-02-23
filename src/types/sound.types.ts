export type SoundType =
    | 'switchToSound'      // Звук смены команды
    | 'transitionMusic'    // Музыка перебивки
    | 'thinkingMusic'      // Музыка размышления
    | 'timerEndSound';    // Звук окончания таймера

export interface SoundSettings {
    switchToSound: string;
    transitionMusic: string;
    thinkingMusic: string;
    timerEndSound: string;
    volume: number;
}

export interface SoundConfig {
    src: string | string[];
    volume?: number;
    loop?: boolean;
    autoplay?: boolean;
    onEnd?: () => void;
    onLoad?: () => void;
    onError?: (error: any) => void;
}

export interface SoundManagerState {
    currentPlaying: SoundType | null;
    isMusicPlaying: boolean;
    volume: number;
    isLoading: boolean;
    error: string | null;
}

// Константы для звуков
export const SOUND_TYPES: SoundType[] = [
    'switchToSound',
    'transitionMusic',
    'thinkingMusic',
    'timerEndSound'
];

// Описания звуков для UI
export const SOUND_DESCRIPTIONS: Record<SoundType, { label: string; description: string }> = {
    switchToSound: {
        label: 'Звук смены команды',
        description: 'Сирена при смене хода'
    },
    transitionMusic: {
        label: 'Звук перебивки',
        description: 'Когда команда закончила петь'
    },
    thinkingMusic: {
        label: 'Музыка размышления',
        description: 'Фоновая музыка во время ответа на вопрос'
    },
    timerEndSound: {
        label: 'Звук окончания таймера',
        description: 'Если время на размышление вышло'
    }
};