import React from 'react';
import {parseAnswerText} from "../../../../utils/answerParser.ts";
import './AnswersDisplay.css';

interface AnswersDisplayProps {
    answers: string[];  // Массив строк с размеченными ответами
}

const AnswersDisplay: React.FC<AnswersDisplayProps> = ({ answers }) => {
    // Разбиваем ответы на две колонки
    const leftColumn: string[] = [];
    const rightColumn: string[] = [];

    answers.forEach((answer, index) => {
        if (index % 2 === 0) {
            leftColumn.push(answer);
        } else {
            rightColumn.push(answer);
        }
    });

    const renderAnswerText = (text: string) => {
        const parsed = parseAnswerText(text);

        return (
            <div className="answer-text">
                {parsed.map((part, idx) => {
                        if (part.type === 'first') {
                            return (
                                <span key={idx} className="answer-part answer-part--first">
                                {part.text}
                                </span>
                        );
                        }
                        if (part.type === 'second') {
                            return (
                                <span key={idx} className="answer-part answer-part--second">
                                {part.text}
                                </span>
                        );
                        }
                        return <span key={idx} className="answer-part">{part.text}</span>;
                    })}
                </div>
        );
    };

    return (
        <div className="answers-display">
        <h3 className="answers-title">Правильные ответы</h3>

        <div className="answers-columns">
            {/* Правая колонка */}
            <div className="answers-column">
                {rightColumn.map((answer, idx) => (
                    <div key={`right-${idx}`}>{renderAnswerText(answer)}</div>
                ))}
            </div>

            {/* Левая колонка */}
            <div className="answers-column">
                {leftColumn.map((answer, idx) => (
                    <div key={`left-${idx}`}>{renderAnswerText(answer)}</div>
                ))}
            </div>
        </div>

        {/* Легенда цветов */}
        <div className="answers-legend">
            <div className="legend-item">
                <span className="legend-color legend-color--first"></span>
                <span>Ответы участника 1</span>
            </div>
            <div className="legend-item">
                <span className="legend-color legend-color--second"></span>
                <span>Ответы участника 2</span>
            </div>
        </div>
    </div>
);
};

export default AnswersDisplay;