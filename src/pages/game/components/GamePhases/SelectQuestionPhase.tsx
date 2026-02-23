import React from 'react';
import Timer from "../../../../components/game/Timer.tsx";
import type {Round, Team} from "../../../../types/game.types.ts";
import './GamePhases.css';

interface SelectQuestionPhaseProps {
    round: Round;
    currentTeam: Team;
    onTimeEnd: () => void;
    onComplete: (winningTeamId: string) => void;
}

const SelectQuestionPhase: React.FC<SelectQuestionPhaseProps> = ({
    round,
    currentTeam,
    onTimeEnd,
    onComplete
}) => {
    return (
        <div className="phase-container selection-phase">
            <h2>Раунд {round.roundNumber}</h2>

            <div className="question-container glass-card">
                <p className="selection-question">
                    {round.selectionQuestion.topic ||
                        'Поочередно называйте песни из мультиков'}
                </p>
            </div>

            <Timer
                initialTime={round.selectionQuestion.timeLimit}
                onTimeEnd={onTimeEnd}
            />

            <div className="teams-turn">
                <p>Сейчас отвечает:</p>
                <div className="current-team pulse">
                    {currentTeam.name}
                </div>
            </div>

            <button
                className="btn btn-glass"
                onClick={() => onComplete(currentTeam.id)}
            >
                Назначить победителем {currentTeam.name}
            </button>
        </div>
    );
};

export default SelectQuestionPhase;