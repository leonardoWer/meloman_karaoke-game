import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {useAppDispatch, useAppSelector} from "../../hooks/reduxHooks.ts";
import confetti from 'canvas-confetti';
import {resetGame} from "../../store/slices/gameSlice.ts";
import Layout from "../../components/common/Layout/Layout.tsx";

import './../Pages.css';

const ResultsPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { teams, winner } = useAppSelector((state) => state.game);
    const [showConfetti, setShowConfetti] = useState(true);

    const winnerTeam = teams.find(t => t.id === winner);
    const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

    useEffect(() => {
        if (showConfetti) {
            // Запускаем конфетти
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

            // Интервал для конфетти
            const interval = setInterval(() => {
                confetti({
                    particleCount: 50,
                    spread: 100,
                    origin: { y: 0.6, x: Math.random() }
                });
            }, 300);

            setTimeout(() => {
                clearInterval(interval);
                setShowConfetti(false);
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [showConfetti]);

    const handleNewGame = () => {
        dispatch(resetGame());
        navigate('/setup');
    };

    return (
        <Layout title="Игра завершена!">
            <div className="results-page">
                {/* Победитель */}
                <div className="winner-announcement glass">
                    <h2 className="winner-title">🏆 ПОБЕДИТЕЛЬ 🏆</h2>
                    <div className="winner-name">{winnerTeam?.name}</div>
                    <div className="winner-score">{winnerTeam?.score} очков</div>
                </div>

                {/* Турнирная таблица */}
                <div className="tournament-table glass">
                    <h3>Итоговая таблица</h3>
                    {sortedTeams.map((team, index) => (
                        <div key={team.id} className="table-row">
                            <div className="table-position">
                                {index === 0 && '🥇'}
                                {index === 1 && '🥈'}
                                {index === 2 && '🥉'}
                                {index > 2 && `${index + 1}.`}
                            </div>
                            <div className="table-team">{team.name}</div>
                            <div className="table-score">{team.score}</div>
                        </div>
                    ))}
                </div>

                {/* Статистика раундов */}
                <div className="rounds-stats glass">
                    <h3>Статистика по раундам</h3>
                    <div className="stats-placeholder">
                        {/* Здесь будет график или детальная статистика */}
                        <p>Статистика будет доступна в следующем обновлении</p>
                    </div>
                </div>

                {/* Кнопки действий */}
                <div className="results-actions">
                    <button className="btn btn-outline" onClick={() => navigate('/game')}>
                        Просмотр игры
                    </button>
                    <button className="btn" onClick={handleNewGame}>
                        Новая игра
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default ResultsPage;