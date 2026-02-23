import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/reduxHooks.ts';
import { updateTeamName, updateGameSettings } from '../../../store/slices/settingsSlice.ts';

import './GameSettings.css';

const GameSettings: React.FC = () => {
    const dispatch = useAppDispatch();
    const { teams, numberOfRounds, selectionTimeLimit } = useAppSelector(
        (state) => state.settings.game
    );
    const rounds = useAppSelector((state) => state.rounds.rounds);

    const handleTeamNameChange = (teamId: string, name: string) => {
        dispatch(updateTeamName({ teamId, name }));
    };

    const handleRoundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 1 && value <= 12) {
            dispatch(updateGameSettings({ numberOfRounds: value }));
        }
    };

    const handleTimeLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 10 && value <= 60) {
            dispatch(updateGameSettings({ selectionTimeLimit: value }));
        }
    };

    // Подсчитываем заполненные раунды
    const completedRounds = rounds.filter(round =>
        round.songs.every(song =>
            song.title.trim() !== '' &&
            song.videoUrl.trim() !== '' &&
            song.correctAnswers.length > 0
        )
    ).length;

    return (
        <div className="settings-container glass">
            <h3>Настройки команд</h3>
            <div className="teams-grid">
                {teams.map((team, index) => (
                    <div key={team.id} className="team-card glass-card">
                        <div className="team-icon">
                            <span>{index + 1}</span>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Название команды {index + 1}</label>
                            <input
                                type="text"
                                className="input-field"
                                value={team.name}
                                onChange={(e) => handleTeamNameChange(team.id, e.target.value)}
                                placeholder={`Команда ${index + 1}`}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <h3 style={{ marginTop: '30px' }}>Параметры игры</h3>
            <div className="settings-grid">
                <div className="input-group">
                    <label className="input-label">Количество раундов (1-12)</label>
                    <input
                        type="number"
                        className="input-field"
                        min="1"
                        max="12"
                        value={numberOfRounds}
                        onChange={handleRoundsChange}
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Время на выбор (сек)</label>
                    <input
                        type="number"
                        className="input-field"
                        min="10"
                        max="60"
                        value={selectionTimeLimit}
                        onChange={handleTimeLimitChange}
                    />
                </div>
            </div>

            {/* Индикатор готовности раундов */}
            <div className="rounds-status glass-card">
                <h4>Статус раундов</h4>
                <div className="progress-info">
                    <span>Заполнено раундов: {completedRounds} из {rounds.length}</span>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${(completedRounds / rounds.length) * 100}%` }}
                        />
                    </div>
                </div>
                {completedRounds < rounds.length && (
                    <p className="warning-text">
                        ⚠️ Заполните все раунды перед началом игры
                    </p>
                )}
            </div>
        </div>
    );
};

export default GameSettings;