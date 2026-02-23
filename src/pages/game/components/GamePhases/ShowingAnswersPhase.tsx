import React from 'react';
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
     teamAnswers
 }) => {
    return (
        <div className="phase-container answers-phase">
            <AnswersDisplay answers={song.correctAnswers} />

            <h4 style={{ marginTop: '30px', marginBottom: '20px' }}>
                Оценка команды: {currentTeam.name}
            </h4>

            <div className="scoring-section">
                <div className="team-scoring glass-card">
                    <h5>{currentTeam.name}</h5>
                    <div className="score-input-group">
                        <input
                            type="number"
                            className="input-field"
                            min="0"
                            max={song.correctAnswers.length}
                            placeholder="Количество баллов"
                            value={teamAnswers[currentTeam.id] || ''}
                            onChange={(e) => {
                                const score = parseInt(e.target.value) || 0;
                                onScoreSubmit(currentTeam.id, score);
                            }}
                        />
                        <div className="score-hint">
                            Максимум: {song.correctAnswers.length}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowingAnswersPhase;