import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { addRound, updateRound, removeRound } from '../../store/slices/roundsSlice';

import './AdminComponents.css';
import type {ValidationError} from "../../utils/validators.ts";

interface RoundSetupProps {
    errors?: ValidationError[];
}

const RoundSetup: React.FC<RoundSetupProps> = ({ errors = [] }) => {
    const dispatch = useAppDispatch();
    const rounds = useAppSelector((state) => state.rounds.rounds);

    const hasError = (roundNumber: number, field: string): boolean => {
        return errors.some(e => e.roundNumber === roundNumber && e.field === field);
    };

    const getFieldClass = (roundNumber: number, field: string) => {
        return hasError(roundNumber, field) ? 'input-field error' : 'input-field';
    };

    // Добавляем первый раунд при загрузке, если их нет
    useEffect(() => {
        if (rounds.length === 0) {
            dispatch(addRound());
        }
    }, [dispatch, rounds.length]);

    const handleSongChange = (
        roundId: string,
        songIndex: number,
        field: 'title' | 'videoUrl' | 'correctAnswers',
        value: string
    ) => {
        const round = rounds.find(r => r.id === roundId);
        if (!round) return;

        const updatedSongs = [...round.songs];
        if (!updatedSongs[songIndex]) {
            // Создаем песню, если её ещё нет
            updatedSongs[songIndex] = {
                id: `temp-${Date.now()}-${songIndex}`,
                title: '',
                videoUrl: '',
                correctAnswers: []
            };
        }

        if (field === 'correctAnswers') {
            // Разбиваем текст на массив строк
            updatedSongs[songIndex] = {
                ...updatedSongs[songIndex],
                correctAnswers: value.split('\n').filter(line => line.trim() !== '')
            };
        } else {
            updatedSongs[songIndex] = {
                ...updatedSongs[songIndex],
                [field]: value
            };
        }

        dispatch(updateRound({
            ...round,
            songs: updatedSongs
        }));
    };

    const handleQuestionChange = (
        roundId: string,
        field: 'topic' | 'timeLimit',
        value: string | number
    ) => {
        const round = rounds.find(r => r.id === roundId);
        if (!round) return;

        dispatch(updateRound({
            ...round,
            selectionQuestion: {
                ...round.selectionQuestion,
                [field]: value
            }
        }));
    };

    return (
        <div className="rounds-container">
            <div className="rounds-header">
                <h3>Настройка раундов</h3>
                <button className="btn btn-glass" onClick={() => dispatch(addRound())}>
                    + Добавить раунд
                </button>
            </div>

            {rounds.map((round) => (
                <div key={round.id} className="round-card glass-card">
                    <div className="round-header">
                        <h4>Раунд {round.roundNumber}</h4>
                        {rounds.length > 1 && (
                            <button
                                className="btn-remove"
                                onClick={() => dispatch(removeRound(round.id))}
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <div className="round-content">

                        <div className="selection-section">
                            <h5>Вопрос для выбора</h5>
                            <select
                                className="input-field"
                                value={round.selectionQuestion.type}
                                onChange={(e) => {
                                    dispatch(updateRound({
                                        ...round,
                                        selectionQuestion: {
                                            ...round.selectionQuestion,
                                            type: e.target.value as 'alternating' | 'custom'
                                        }
                                    }));
                                }}
                            >
                                <option value="alternating">Поочередное называние</option>
                                <option value="custom">Свой вопрос</option>
                            </select>

                            <input
                                type="text"
                                className="input-field"
                                placeholder="Тема (например: 'Песни из мультиков')"
                                value={round.selectionQuestion.topic || ''}
                                onChange={(e) => handleQuestionChange(round.id, 'topic', e.target.value)}
                            />

                            <div className="input-group">
                                <label className="input-label">Время на ответ (сек)</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={round.selectionQuestion.timeLimit}
                                    min="5"
                                    max="60"
                                    onChange={(e) => handleQuestionChange(round.id, 'timeLimit', parseInt(e.target.value) || 30)}
                                />
                            </div>
                        </div>

                        <div className="songs-section">
                            <h5>Песни</h5>
                            {[0, 1].map((songIndex) => (
                                <div key={songIndex} className="song-input-group">
                                    <div className="song-label">Песня {songIndex + 1}</div>
                                    <input
                                        type="text"
                                        className={getFieldClass(round.roundNumber, `song_${songIndex + 1}_title`)}
                                        placeholder="Название песни"
                                        value={round.songs[songIndex]?.title || ''}
                                        onChange={(e) => handleSongChange(round.id, songIndex, 'title', e.target.value)}
                                    />
                                    <input
                                        type="url"
                                        className={getFieldClass(round.roundNumber, `song_${songIndex + 1}_url`)}
                                        placeholder="Ссылка на видео"
                                        value={round.songs[songIndex]?.videoUrl || ''}
                                        onChange={(e) => handleSongChange(round.id, songIndex, 'videoUrl', e.target.value)}
                                    />
                                    <textarea
                                        className={getFieldClass(round.roundNumber, `song_${songIndex + 1}_answers`)}
                                        placeholder="Правильные ответы"
                                        value={round.songs[songIndex]?.correctAnswers?.join('\n') || ''}
                                        onChange={(e) => handleSongChange(round.id, songIndex, 'correctAnswers', e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            ))}
        </div>
    );
};

export default RoundSetup;