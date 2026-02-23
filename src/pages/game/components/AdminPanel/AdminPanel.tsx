import React from 'react';
import {useSound} from "../../../../hooks/useSound.ts";

import './AdminPanel.css';


interface AdminPanelProps {
    onSwitchTeam: () => void;
    onNextRound: () => void;
    onPauseGame: () => void;
    isPaused: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
   onSwitchTeam,
   onNextRound,
   onPauseGame,
   isPaused
}) => {
    const { playSound } = useSound();

    const handleSwitchTeam = () => {
        onSwitchTeam();
    };

    const handleNextRound = () => {
        playSound('transitionMusic');
        onNextRound();
    };

    return (
        <div className="admin-panel">
            <div className="admin-panel-content glass">
                <button
                    className="admin-btn"
                    onClick={handleSwitchTeam}
                    title="Принудительная смена команды"
                >
                    🔄 Смена хода
                </button>
                <button
                    className="admin-btn"
                    onClick={onPauseGame}
                    title="Пауза"
                >
                    {isPaused ? '▶️' : '⏸️'}
                </button>
                <button
                    className="admin-btn"
                    onClick={handleNextRound}
                    title="Перейти к следующему раунду"
                >
                    ⏭️ Следующий раунд
                </button>
            </div>
        </div>
    );
};

export default AdminPanel;