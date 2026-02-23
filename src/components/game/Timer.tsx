import React, { useState, useEffect } from 'react';
import './Timer.css';

interface TimerProps {
    initialTime: number;
    onTimeEnd: () => void;
    isActive?: boolean;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeEnd, isActive = true }) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        if (!isActive) return;

        if (timeLeft <= 0) {
            onTimeEnd();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isActive, onTimeEnd]);

    useEffect(() => {
        setTimeLeft(initialTime);
    }, [initialTime]);

    const percentage = (timeLeft / initialTime) * 100;

    // Определяем цвет в зависимости от оставшегося времени
    const getColor = () => {
        if (percentage > 60) return 'var(--success)';
        if (percentage > 30) return 'var(--warning)';
        return 'var(--error)';
    };

    // Форматируем время в MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="timer-container">
            <div className="timer-display">
                <div className="timer-value" style={{ color: getColor() }}>
                    {formatTime(timeLeft)}
                </div>
                <svg className="timer-progress" viewBox="0 0 100 100">
                    <circle
                        className="timer-progress-bg"
                        cx="50"
                        cy="50"
                        r="45"
                    />
                    <circle
                        className="timer-progress-fill"
                        cx="50"
                        cy="50"
                        r="45"
                        style={{
                            stroke: getColor(),
                            strokeDasharray: `${2 * Math.PI * 45}`,
                            strokeDashoffset: `${(2 * Math.PI * 45) * (1 - timeLeft / initialTime)}`
                        }}
                    />
                </svg>
            </div>
        </div>
    );
};

export default Timer;