import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {useAppDispatch, useAppSelector} from "../../hooks/reduxHooks.ts";
import {addScore, nextRound, setGamePhase} from "../../store/slices/gameSlice.ts";
import Layout from "../../components/common/Layout/Layout.tsx";
import Timer from "../../components/game/Timer.tsx";

import './../Pages.css';

const GamePage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { teams, currentRound, gamePhase } = useAppSelector((state) => state.game);
    const rounds = useAppSelector((state) => state.rounds.rounds);

    const [selectedSong, setSelectedSong] = useState<string | null>(null);
    const [showAnswers, setShowAnswers] = useState(false);
    const [teamAnswers, setTeamAnswers] = useState<Record<string, number>>({});

    // Эффект для проверки завершения игры
    useEffect(() => {
        if (gamePhase === 'results') {
            navigate('/results');
        }
    }, [gamePhase, navigate]);

    const handleTimeEnd = () => {
        // Логика окончания времени
        console.log('Время вышло!');
    };

    const handleSongSelect = (songId: string) => {
        setSelectedSong(songId);
        dispatch(setGamePhase('watching-video'));
    };

    const handleVideoEnd = () => {
        setShowAnswers(true);
        dispatch(setGamePhase('showing-answers'));
    };

    const handleScoreSubmit = (teamId: string, score: number) => {
        dispatch(addScore({ teamId, points: score }));
        setTeamAnswers(prev => ({ ...prev, [teamId]: score }));

        // Если обе команды получили оценки, переходим к следующему раунду
        if (Object.keys(teamAnswers).length === 2) {
            setTeamAnswers({});
            setShowAnswers(false);
            setSelectedSong(null);
            dispatch(nextRound());
            dispatch(setGamePhase('selection-question'));
        }
    };

    return (
        <Layout title="Караоке битва">
            <div className="game-page">
                {/* Счет команд */}
                <div className="scoreboard glass">
                    {teams.map((team, index) => (
                        <div key={team.id} className="team-score">
                            <div className="team-score-header">
                                <div className="team-icon small" style={{ background: index === 0 ? '#1e4b8c' : '#7b2cbf' }}>
                                    {index + 1}
                                </div>
                                <span className="team-name">{team.name}</span>
                            </div>
                            <div className="score-value">{team.score}</div>
                        </div>
                    ))}
                </div>

                {/* Игровая область */}
                <div className="game-area glass">
                    {gamePhase === 'selection-question' && (
                        <div className="selection-phase">
                            <h2>Раунд {currentRound + 1}</h2>
                            <p className="selection-question">
                                {rounds[currentRound]?.selectionQuestion.topic ||
                                    'Поочередно называйте песни из мультиков'}
                            </p>

                            <Timer
                                initialTime={rounds[currentRound]?.selectionQuestion.timeLimit || 30}
                                onTimeEnd={handleTimeEnd}
                            />

                            <div className="teams-turn">
                                <p>Сейчас отвечает:</p>
                                <div className="current-team pulse">
                                    {teams[currentRound % 2].name}
                                </div>
                            </div>

                            <button
                                className="btn btn-glass"
                                onClick={() => dispatch(setGamePhase('song-selection'))}
                            >
                                Завершить выбор
                            </button>
                        </div>
                    )}

                    {gamePhase === 'song-selection' && (
                        <div className="song-selection">
                            <h3>Выберите песню</h3>
                            <div className="songs-grid">
                                {rounds[currentRound]?.songs.map((song, index) => (
                                    <button
                                        key={song.id}
                                        className="song-card glass-card"
                                        onClick={() => handleSongSelect(song.id)}
                                    >
                                        <div className="song-number">{index + 1}</div>
                                        <div className="song-title">{song.title}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {gamePhase === 'watching-video' && selectedSong && (
                        <div className="video-phase">
                            <div className="video-placeholder glass-card">
                                <div className="video-info">
                                    <h3>Сейчас играет:</h3>
                                    <p className="current-song">
                                        {rounds[currentRound]?.songs.find(s => s.id === selectedSong)?.title}
                                    </p>
                                </div>
                                {/* Здесь будет компонент видео */}
                                <div className="mock-video">
                                    🎵 Видеоплеер будет здесь 🎵
                                </div>
                                <button className="btn" onClick={handleVideoEnd}>
                                    Пропустить видео (тест)
                                </button>
                            </div>
                        </div>
                    )}

                    {gamePhase === 'showing-answers' && selectedSong && (
                        <div className="answers-phase">
                            <h3>Правильные ответы</h3>
                            <div className="answers-grid">
                                {rounds[currentRound]?.songs
                                    .find(s => s.id === selectedSong)
                                    ?.correctAnswers.map((answer, index) => (
                                        <div key={index} className="answer-item glass-card">
                                            {answer}
                                        </div>
                                    ))}
                            </div>

                            <h4 style={{ marginTop: '30px' }}>Оценка команд</h4>
                            <div className="scoring-section">
                                {teams.map((team) => (
                                    <div key={team.id} className="team-scoring glass-card">
                                        <h5>{team.name}</h5>
                                        <div className="score-input-group">
                                            <input
                                                type="number"
                                                className="input-field"
                                                min="0"
                                                max={rounds[currentRound]?.songs
                                                    .find(s => s.id === selectedSong)
                                                    ?.correctAnswers.length || 10}
                                                placeholder="Количество баллов"
                                                onChange={(e) => {
                                                    const score = parseInt(e.target.value) || 0;
                                                    setTeamAnswers(prev => ({ ...prev, [team.id]: score }));
                                                }}
                                            />
                                            <button
                                                className="btn btn-small"
                                                onClick={() => handleScoreSubmit(team.id, teamAnswers[team.id] || 0)}
                                                disabled={teamAnswers[team.id] === undefined}
                                            >
                                                Подтвердить
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Админ-панель (только для организатора) */}
                <div className="admin-panel glass">
                    <button className="btn-glass btn-small">🔊 Переход хода</button>
                    <button className="btn-glass btn-small">⏸️ Пауза</button>
                    <button className="btn-glass btn-small">⏭️ Следующий раунд</button>
                </div>
            </div>
        </Layout>
    );
};

export default GamePage;