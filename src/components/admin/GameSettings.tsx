import React from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { updateTeamName, updateGameSettings } from '../../store/slices/settingsSlice';
import './AdminComponents.css';

const GameSettings: React.FC = () => {
    const dispatch = useAppDispatch();
    const { teams, numberOfRounds, selectionTimeLimit } = useAppSelector(
        (state) => state.settings.game
    );

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
        </div>
    );
};

export default GameSettings;