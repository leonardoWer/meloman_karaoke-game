import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {useAppDispatch, useAppSelector} from "../../hooks/reduxHooks.ts";
import {useSound} from "../../hooks/useSound.ts";
import {addScore, nextRound, setGamePhase} from "../../store/slices/gameSlice.ts";
import Layout from "../../components/common/Layout/Layout.tsx";
import ScoreBoard from "./components/ScoreBoard/ScoreBoard.tsx";
import SelectSongPhase from "./components/GamePhases/SelectSongPhase.tsx";
import WatchingVideoPhase from "./components/GamePhases/WatchingVideoPhase.tsx";
import ShowingAnswersPhase from "./components/GamePhases/ShowingAnswersPhase.tsx";
import AdminPanel from "./components/AdminPanel/AdminPanel.tsx";
import './GamePage.css';
import SelectQuestionPhase from "./components/GamePhases/SelectQuestionPhase.tsx";

interface GameState {
    selectedSongId: string | null;
    teamAnswers: Record<string, number>;
    isPaused: boolean;
    currentPhaseTeamIndex: number; // 0 или 1 - какая команда сейчас ходит
}

const GamePage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { teams, currentRound, gamePhase} = useAppSelector((state) => state.game);
    const rounds = useAppSelector((state) => state.rounds.rounds);
    const { playSound, playMusic, stopMusic } = useSound();

    const [state, setState] = useState<GameState>({
        selectedSongId: null,
        teamAnswers: {},
        isPaused: false,
        currentPhaseTeamIndex: 0 // Начинает команда 1
    });

    const currentRoundData = rounds[currentRound];
    const currentTeam = teams[state.currentPhaseTeamIndex];
    const selectedSong = currentRoundData?.songs.find(s => s.id === state.selectedSongId);

    // Музыка для разных фаз
    useEffect(() => {
        if (state.isPaused) {
            stopMusic();
            return;
        }

        if (gamePhase === 'selection-question') {
            playMusic('thinkingMusic');
        } else {
            stopMusic();
        }
    }, [gamePhase, state.isPaused, playMusic, stopMusic]);

    // Проверка завершения игры
    useEffect(() => {
        if (gamePhase === 'results') {
            navigate('/results');
        }
    }, [gamePhase, navigate]);

    const handleTimeEnd = useCallback(() => {
        playSound('timerEndSound');
        // Автоматически переходим к выбору песни
        dispatch(setGamePhase('song-selection'));
    }, [playSound, dispatch]);

    const handleSelectionComplete = useCallback(() => {
        dispatch(setGamePhase('song-selection'));
    }, [dispatch]);

    const handleSongSelect = useCallback((songId: string) => {
        setState(prev => ({ ...prev, selectedSongId: songId }));
        dispatch(setGamePhase('watching-video'));
    }, [dispatch]);

    const handleVideoEnd = useCallback(() => {
        playSound('transitionMusic');
        dispatch(setGamePhase('showing-answers'));
    }, [playSound, dispatch]);

    const handleScoreSubmit = useCallback((teamId: string, score: number) => {
        // Добавляем баллы команде
        dispatch(addScore({ teamId, points: score }));

        setState(prev => ({
            ...prev,
            teamAnswers: { ...prev.teamAnswers, [teamId]: score }
        }));

        // Если это была первая команда, переключаем на вторую
        if (state.currentPhaseTeamIndex === 0) {
            setState(prev => ({
                ...prev,
                currentPhaseTeamIndex: 1,
                selectedSongId: null,
                teamAnswers: {}
            }));
            dispatch(setGamePhase('song-selection'));
        } else {
            // Если это была вторая команда, переходим к следующему раунду
            setState(prev => ({
                ...prev,
                currentPhaseTeamIndex: 0,
                selectedSongId: null,
                teamAnswers: {}
            }));

            if (currentRound + 1 < rounds.length) {
                dispatch(nextRound());
                dispatch(setGamePhase('selection-question'));
            } else {
                dispatch(setGamePhase('results'));
            }
        }
    }, [dispatch, state.currentPhaseTeamIndex, currentRound, rounds.length]);

    const handleSwitchTeam = useCallback(() => {
        setState(prev => ({
            ...prev,
            currentPhaseTeamIndex: prev.currentPhaseTeamIndex === 0 ? 1 : 0
        }));
        playSound('switchToSound');
    }, [playSound]);

    const handleNextRound = useCallback(() => {
        if (currentRound + 1 < rounds.length) {
            dispatch(nextRound());
            setState(prev => ({
                ...prev,
                currentPhaseTeamIndex: 0,
                selectedSongId: null,
                teamAnswers: {}
            }));
            dispatch(setGamePhase('selection-question'));
        } else {
            dispatch(setGamePhase('results'));
        }
        playSound('transitionMusic');
    }, [dispatch, currentRound, rounds.length, playSound]);

    const handlePauseGame = useCallback(() => {
        setState(prev => ({ ...prev, isPaused: !prev.isPaused }));
    }, []);

    if (!currentRoundData) {
        return (
            <Layout title="Ошибка">
                <div className="error-container">
                    <p>Раунды не настроены. Вернитесь к настройке игры.</p>
                    <button className="btn" onClick={() => navigate('/setup')}>
                        Настройка игры
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Караоке битва">
            <div className="game-page">
                <ScoreBoard teams={teams} currentTeamId={currentTeam.id} />

                <div className="game-area glass">
                    {gamePhase === 'selection-question' && (
                        <SelectQuestionPhase
                            round={currentRoundData}
                            currentTeam={currentTeam}
                            onTimeEnd={handleTimeEnd}
                            onComplete={handleSelectionComplete}
                        />
                    )}

                    {gamePhase === 'song-selection' && (
                        <SelectSongPhase
                            songs={currentRoundData.songs}
                            onSelectSong={handleSongSelect}
                        />
                    )}

                    {gamePhase === 'watching-video' && selectedSong && (
                        <WatchingVideoPhase
                            song={selectedSong}
                            onVideoEnd={handleVideoEnd}
                        />
                    )}

                    {gamePhase === 'showing-answers' && selectedSong && (
                        <ShowingAnswersPhase
                            song={selectedSong}
                            teams={teams}
                            currentTeam={currentTeam}
                            onScoreSubmit={handleScoreSubmit}
                            teamAnswers={state.teamAnswers}
                        />
                    )}
                </div>

                <AdminPanel
                    onSwitchTeam={handleSwitchTeam}
                    onNextRound={handleNextRound}
                    onPauseGame={handlePauseGame}
                    isPaused={state.isPaused}
                />
            </div>
        </Layout>
    );
};

export default GamePage;