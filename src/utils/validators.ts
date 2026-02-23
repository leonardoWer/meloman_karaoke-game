import type {Round} from '../types/game.types';

export interface ValidationError {
    roundNumber: number;
    field: string;
    message: string;
}

export const validateRounds = (rounds: Round[]): ValidationError[] => {
    const errors: ValidationError[] = [];

    rounds.forEach((round, index) => {
        const roundNumber = index + 1;

        // Проверяем, что есть хотя бы один раунд
        if (rounds.length === 0) {
            errors.push({
                roundNumber: 0,
                field: 'rounds',
                message: 'Добавьте хотя бы один раунд'
            });
            return;
        }

        // Проверяем песни в раунде
        round.songs.forEach((song, songIndex) => {
            if (!song.title.trim()) {
                errors.push({
                    roundNumber,
                    field: `song_${songIndex + 1}_title`,
                    message: `В раунде ${roundNumber} укажите название песни ${songIndex + 1}`
                });
            }

            if (!song.videoUrl.trim()) {
                errors.push({
                    roundNumber,
                    field: `song_${songIndex + 1}_video`,
                    message: `В раунде ${roundNumber} укажите ссылку на видео для песни ${songIndex + 1}`
                });
            }

            if (song.correctAnswers.length === 0) {
                errors.push({
                    roundNumber,
                    field: `song_${songIndex + 1}_answers`,
                    message: `В раунде ${roundNumber} добавьте правильные ответы для песни ${songIndex + 1}`
                });
            }
        });

        // Проверяем вопрос для выбора
        if (round.selectionQuestion.type === 'custom' && !round.selectionQuestion.topic?.trim()) {
            errors.push({
                roundNumber,
                field: 'question_topic',
                message: `В раунде ${roundNumber} укажите тему вопроса`
            });
        }
    });

    return errors;
};

export const isGameReadyToStart = (rounds: Round[]): boolean => {
    const errors = validateRounds(rounds);
    return errors.length === 0;
};