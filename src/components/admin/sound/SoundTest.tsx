import React, { useRef } from 'react';
import { useAppSelector } from '../../../hooks/reduxHooks.ts';
import './SoundSettings.css';

const SoundTest: React.FC = () => {
    const soundSettings = useAppSelector((state) => state.settings.sound);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const playSound = (soundUrl: string) => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        audioRef.current = new Audio(soundUrl);
        audioRef.current.volume = soundSettings.volume;
        audioRef.current.play().catch(e => console.log('Ошибка воспроизведения:', e));
    };

    return (
        <div className="sound-test">
            <h4>Тест звуков</h4>
            <div className="sound-test-buttons">
                <button className="btn-glass btn-small" onClick={() => playSound(soundSettings.switchToSound)}>
                    🔊 Сирена
                </button>
                <button className="btn-glass btn-small" onClick={() => playSound(soundSettings.transitionMusic)}>
                    🎵 Перебивка
                </button>
                <button className="btn-glass btn-small" onClick={() => playSound(soundSettings.thinkingMusic)}>
                    🎵 Музыка размышления
                </button>
                <button className="btn-glass btn-small" onClick={() => playSound(soundSettings.timerEndSound)}>
                    ⏰ Окончание таймера
                </button>
            </div>
        </div>
    );
};

export default SoundTest;