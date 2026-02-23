import React from 'react';
import './GamePhases.css';
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
            <h3>Правильные ответы</h3>
            <div className="answers-grid">
                {song.correctAnswers.map((answer, index) => (
                    <div key={index} className="answer-item glass-card">
                        {answer}
                    </div>
                ))}
            </div>

            <h4 style={{ marginTop: '30px' }}>
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