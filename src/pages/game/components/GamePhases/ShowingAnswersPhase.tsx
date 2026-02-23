import React, {useState} from 'react';
import './GamePhases.css';
import AnswersDisplay from "../AnswersDisplay/AnswersDisplay.tsx";
import type {Song, Team} from "../../../../types/game.types.ts";

interface ShowingAnswersPhaseProps {
    song: Song;
    teams: Team[];
    currentTeam: Team;
    onScoreSubmit: (teamId: string, score: number) => void;
    teamAnswers: Record<string, number>;
}

const ShowingAnswersPhase: React.FC<ShowingAnswersPhaseProps> = ({
    song,
    currentTeam,
    onScoreSubmit,
    teamAnswers,
 }) => {
    const [currentTeamScore, setCurrentTeamScore] = useState<number>(0);

    const handleSubmit = () => {
        if (currentTeamScore > 0) {
            onScoreSubmit(currentTeam.id, currentTeamScore);
        } else {
            // Если баллы не введены, отправляем 0
            onScoreSubmit(currentTeam.id, 0);
        }
    };

    return (
        <div className="phase-container answers-phase">
            <AnswersDisplay answers={song.correctAnswers} />

            <div className="scoring-section">
                <div className="team-scoring glass-card">
                    <h2>Баллы: {currentTeam.name}</h2>
                    <div className="score-input-group">
                        <input
                            type="number"
                            className="input-field"
                            min="0"
                            placeholder="Количество баллов"
                            value={teamAnswers[currentTeam.id] !== undefined ? teamAnswers[currentTeam.id] : currentTeamScore}
                            onChange={(e) => {
                                const score = parseInt(e.target.value) || 0;
                                setCurrentTeamScore(score);
                            }}
                        />
                    </div>
                </div>

                <button
                    className="btn btn__sa-next"
                    onClick={handleSubmit}
                    title="Пропустить оценку и перейти далее"
                >
                    Далее
                </button>
            </div>
        </div>
    );
};

export default ShowingAnswersPhase;