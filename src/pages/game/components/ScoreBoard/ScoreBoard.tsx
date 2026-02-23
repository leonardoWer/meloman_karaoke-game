import React from 'react';
import type {Team} from "../../../../types/game.types.ts";

import './ScoreBoard.css';

interface ScoreBoardProps {
    teams: Team[];
    currentTeamId: string | null;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ teams, currentTeamId }) => {
    return (
        <div className="scoreboard glass">
            {teams.map((team, index) => (
                <div
                    key={team.id}
                    className={`team-score ${currentTeamId === team.id ? 'active-team' : ''}`}
                >
                    <div className="team-score-header">
                        <div
                            className="team-icon"
                            style={{ background: index === 0 ? 'var(--primary-main)' : 'var(--accent-purple)' }}
                        >
                            {index + 1}
                        </div>
                        <span className="team-name">{team.name}</span>
                    </div>
                    <div className="score-value">{team.score}</div>
                    {currentTeamId === team.id && (
                        <div className="active-indicator pulse">🎤 ХОД</div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ScoreBoard;