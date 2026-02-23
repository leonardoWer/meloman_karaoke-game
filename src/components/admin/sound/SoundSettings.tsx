import React, {useEffect, useRef, useState} from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/reduxHooks.ts';
import { useSound } from '../../../hooks/useSound.ts';
import { updateSoundSettings } from '../../../store/slices/settingsSlice.ts';
import type {SoundType} from '../../../types/sound.types.ts';
import './SoundSettings.css';

const SoundSettings: React.FC = () => {
    const dispatch = useAppDispatch();
    const soundSettings = useAppSelector((state) => state.settings.sound);
    const { testSound, stopSound } = useSound();
    const [uploadingFor, setUploadingFor] = useState<SoundType | null>(null);
    const [playingSound, setPlayingSound] = useState<SoundType | null>(null);

    // Правильно типизируем рефы
    const fileInputRefs: Record<SoundType, React.RefObject<HTMLInputElement | null>> = {
        switchToSound: useRef<HTMLInputElement | null>(null),
        transitionMusic: useRef<HTMLInputElement | null>(null),
        thinkingMusic: useRef<HTMLInputElement | null>(null),
        timerEndSound: useRef<HTMLInputElement | null>(null)
    };

    // Эффект для отслеживания окончания звука
    useEffect(() => {
        if (!playingSound) return;

        // Создаем аудио элемент для отслеживания
        const audio = new Audio(soundSettings[playingSound]);
        audio.volume = soundSettings.volume;

        const handleEnded = () => {
            setPlayingSound(null);
        };

        audio.addEventListener('ended', handleEnded);

        // Очистка
        return () => {
            audio.removeEventListener('ended', handleEnded);
        };
    }, [playingSound, soundSettings]);

    const handleFileUpload = (type: SoundType) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            dispatch(updateSoundSettings({ [type]: url }));

            // Тестируем загруженный звук
            setTimeout(() => {
                testSound(type, url);
                setPlayingSound(type);
            }, 100);
        }
        setUploadingFor(null);
    };

    const handleTestSound = (type: SoundType, customUrl?: string) => {
        if (playingSound === type) {
            // Если этот звук сейчас играет, останавливаем его
            stopSound(type);
            setPlayingSound(null);
        } else {
            // Останавливаем предыдущий звук, если он играет
            if (playingSound) {
                stopSound(playingSound);
            }

            // Воспроизводим новый
            testSound(type, customUrl);
            setPlayingSound(type);

            // Для музыки размышления устанавливаем таймер на остановку через 3 секунды
            if (type === 'thinkingMusic' || type === 'transitionMusic') {
                setTimeout(() => {
                    stopSound(type);
                    setPlayingSound(prev => prev === type ? null : prev);
                }, 5000);
            }
        }
    };

    const handleUploadClick = (type: SoundType) => {
        setUploadingFor(type);
        fileInputRefs[type]?.current?.click();
    };

    const sounds: Array<{ key: SoundType; label: string; description: string }> = [
        { key: 'switchToSound', label: 'Звук смены команды', description: 'Сирена при смене хода' },
        { key: 'transitionMusic', label: 'Звук перебивки', description: 'Когда команда закончила петь' },
        { key: 'thinkingMusic', label: 'Музыка размышления', description: 'Фоновая музыка во время ответа на вопрос' },
        { key: 'timerEndSound', label: 'Звук окончания таймера', description: 'Если время на размышление вышло' }
    ];

    return (
        <div className="sound-settings glass">
            <h3>Звуковые эффекты</h3>

            <div className="volume-control">
                <label className="input-label">Громкость</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={soundSettings.volume}
                    onChange={(e) => dispatch(updateSoundSettings({ volume: parseFloat(e.target.value) }))}
                    className="volume-slider"
                />
                <span className="volume-value">{Math.round(soundSettings.volume * 100)}%</span>
            </div>

            {sounds.map(({ key, label, description }) => (
                <div key={key} className="sound-item">
                    <div className="sound-info">
                        <h4>{label}</h4>
                        <p className="sound-description">{description}</p>
                    </div>
                    <div className="sound-controls">
                        <button
                            className={`btn btn-glass btn-small ${playingSound === key ? 'playing' : ''}`}
                            onClick={() => handleTestSound(key)}
                            title={playingSound === key ? 'Остановить' : 'Тестовое воспроизведение'}
                        >
                            {playingSound === key ? '⏸ Стоп' : '▶ Тест'}
                        </button>
                        <button
                            className="btn btn-glass btn-small"
                            onClick={() => handleUploadClick(key)}
                            disabled={uploadingFor === key}
                        >
                            {uploadingFor === key ? '⏳' : '📁 Загрузить'}
                        </button>
                        <input
                            type="file"
                            ref={fileInputRefs[key]}
                            onChange={handleFileUpload(key)}
                            accept="audio/*"
                            style={{ display: 'none' }}
                        />
                        <span className="sound-filename" title={soundSettings[key]}>
                            {soundSettings[key]?.split('/').pop() || 'Не выбран'}
                        </span>
                    </div>
                </div>
            ))}

            <div className="sound-info-note">
                <p>💡 Подсказка: Загрузите свои звуки или используйте стандартные.
                    Поддерживаются форматы MP3, WAV, OGG.</p>
            </div>
        </div>
    );
};

export default SoundSettings;