import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import GameSettings from "../../components/admin/game_settings/GameSettings.tsx";
import RoundSetup from "../../components/admin/RoundSetup.tsx";
import SoundSettings from "../../components/admin/sound/SoundSettings.tsx";
import Layout from "../../components/common/Layout/Layout.tsx";
import {setGamePhase} from "../../store/slices/gameSlice.ts";
import {useAppDispatch, useAppSelector} from "../../hooks/reduxHooks.ts";

import './../Pages.css';
import {validateRounds, type ValidationError} from "../../utils/validators.ts";

const SetupPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
    const [showErrors, setShowErrors] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const rounds = useAppSelector((state) => state.rounds.rounds);

    const tabs = ['Общие настройки', 'Раунды', 'Звуки'];

    const handleStartGame = () => {
        // Валидируем раунды перед началом игры
        const errors = validateRounds(rounds);

        if (errors.length > 0) {
            setValidationErrors(errors);
            setShowErrors(true);
            // Переключаемся на вкладку с раундами, чтобы пользователь мог исправить ошибки
            setActiveTab(1);

            // Прокручиваем к ошибкам через небольшой таймаут
            setTimeout(() => {
                const firstError = document.querySelector('.error-message');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);

            return;
        }

        // Если всё ок, начинаем игру
        dispatch(setGamePhase('selection-question'));
        navigate('/game');
    };

    const getTabClass = (index: number) => {
        if (!showErrors) return `tab ${activeTab === index ? 'active' : ''}`;

        // Подсвечиваем вкладку с раундами красным, если есть ошибки
        if (index === 1 && validationErrors.length > 0) {
            return `tab ${activeTab === index ? 'active' : ''} tab-with-errors`;
        }

        return `tab ${activeTab === index ? 'active' : ''}`;
    };

    return (
        <Layout title="Настройка игры">
            <div className="setup-page">
                <div className="tabs">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab}
                            className={getTabClass(index)}
                            onClick={() => {
                                setActiveTab(index);
                                setShowErrors(false); // Скрываем ошибки при смене вкладки
                            }}
                        >
                            {tab}
                            {index === 1 && validationErrors.length > 0 && showErrors && (
                                <span className="error-badge">{validationErrors.length}</span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="tab-content">
                    {activeTab === 0 && <GameSettings />}
                    {activeTab === 1 && (
                        <>
                            {showErrors && validationErrors.length > 0 && (
                                <div className="validation-errors glass">
                                    <h4>Необходимо исправить следующие ошибки:</h4>
                                    <ul className="errors-list">
                                        {validationErrors.map((error, index) => (
                                            <li key={index} className="error-message">
                                                ⚠️ {error.message}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <RoundSetup />
                        </>
                    )}
                    {activeTab === 2 && <SoundSettings />}
                </div>

                <div className="setup-actions">
                    <button className="btn btn-outline" onClick={() => navigate('/')}>
                        Отмена
                    </button>
                    <button
                        className="btn"
                        onClick={handleStartGame}
                    >
                        Начать игру
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default SetupPage;