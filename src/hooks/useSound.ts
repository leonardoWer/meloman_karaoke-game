import { useCallback, useEffect, useRef, useState } from 'react';
import { soundManager } from '../utils/soundManager';
import { useAppSelector } from './reduxHooks';
import type {SoundType} from '../types/sound.types';

export const useSound = () => {
    const soundSettings = useAppSelector((state) => state.settings.sound);
    const initialized = useRef(false);
    const [currentlyPlaying, setCurrentlyPlaying] = useState<SoundType | null>(null);
    const audioElements = useRef<Map<string, HTMLAudioElement>>(new Map());

    // Инициализация громкости при первом использовании
    useEffect(() => {
        if (!initialized.current) {
            soundManager.setVolume(soundSettings.volume * 100);
            initialized.current = true;
        }
    }, [soundSettings.volume]);

    // Обновление громкости при изменении
    useEffect(() => {
        soundManager.setVolume(soundSettings.volume * 100);
        // Обновляем громкость для всех созданных аудио элементов
        audioElements.current.forEach(audio => {
            audio.volume = soundSettings.volume;
        });
    }, [soundSettings.volume]);

    const stopAllSounds = useCallback(() => {
        audioElements.current.forEach((audio) => {
            audio.pause();
            audio.currentTime = 0;
        });
        audioElements.current.clear();
        soundManager.stopMusic();
        setCurrentlyPlaying(null);
    }, []);

    const stopSound = useCallback((type: SoundType) => {
        const audio = audioElements.current.get(type);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            audioElements.current.delete(type);
        }

        if (type === 'thinkingMusic') {
            soundManager.stopMusic();
        }

        setCurrentlyPlaying(prev => prev === type ? null : prev);
    }, []);

    const playSound = useCallback((type: SoundType, customUrl?: string) => {
        // Останавливаем этот звук, если он уже играет
        if (audioElements.current.has(type)) {
            stopSound(type);
        }

        const soundUrl = customUrl || soundSettings[type];
        if (typeof soundUrl !== 'string') return;

        // Для фоновой музыки используем soundManager
        if (type === 'thinkingMusic') {
            soundManager.playMusic(type, { src: soundUrl });
            setCurrentlyPlaying(type);
            return;
        }

        // Для остальных звуков создаем новый Audio элемент
        const audio = new Audio(soundUrl);
        audio.volume = soundSettings.volume;

        // Добавляем обработчик окончания воспроизведения
        audio.addEventListener('ended', () => {
            audioElements.current.delete(type);
            setCurrentlyPlaying(prev => prev === type ? null : prev);
        });

        audio.play().catch(e => {
            console.log('Ошибка воспроизведения:', e);
            audioElements.current.delete(type);
            setCurrentlyPlaying(prev => prev === type ? null : prev);
        });

        audioElements.current.set(type, audio);
        setCurrentlyPlaying(type);
    }, [soundSettings, stopSound]);

    const playMusic = useCallback((type: SoundType) => {
        const soundUrl = soundSettings[type];
        if (typeof soundUrl !== 'string') return;

        // Останавливаем предыдущую музыку
        if (currentlyPlaying === 'thinkingMusic') {
            stopSound('thinkingMusic');
        }

        soundManager.playMusic(type, { src: soundUrl });
        setCurrentlyPlaying(type);
    }, [soundSettings, currentlyPlaying, stopSound]);

    const stopMusic = useCallback(() => {
        soundManager.stopMusic();
        setCurrentlyPlaying(null);
    }, []);

    const testSound = useCallback((type: SoundType, customUrl?: string) => {
        // Если этот звук сейчас играет, останавливаем его
        if (currentlyPlaying === type) {
            stopSound(type);
            return;
        }

        // Останавливаем любой другой играющий звук
        if (currentlyPlaying) {
            stopSound(currentlyPlaying);
        }

        playSound(type, customUrl);
    }, [currentlyPlaying, playSound, stopSound]);

    const isPlaying = useCallback((type: SoundType) => {
        return currentlyPlaying === type;
    }, [currentlyPlaying]);

    // Очистка при размонтировании
    useEffect(() => {
        return () => {
            stopAllSounds();
        };
    }, [stopAllSounds]);

    return {
        playSound,
        playMusic,
        stopMusic,
        stopSound,
        stopAllSounds,
        testSound,
        isPlaying,
        currentlyPlaying
    };
};