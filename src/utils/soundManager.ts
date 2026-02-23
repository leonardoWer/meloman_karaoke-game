import { Howl, Howler } from 'howler';

export interface SoundConfig {
    src: string | string[];
    volume?: number;
    loop?: boolean;
    autoplay?: boolean;
    onEnd?: () => void;
    onLoad?: () => void;
    onError?: (error: any) => void;
}

class SoundManager {
    private static instance: SoundManager;
    private sounds: Map<string, Howl> = new Map();
    private currentMusic: Howl | null = null;
    private currentMusicKey: string | null = null;
    private volume: number = 0.7;
    private musicPlaying: boolean = false;

    private constructor() {}

    static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    // Загрузка и подготовка звука
    loadSound(key: string, config: SoundConfig): Howl {
        // Если звук уже загружен, возвращаем его
        if (this.sounds.has(key)) {
            return this.sounds.get(key)!;
        }

        const sound = new Howl({
            src: Array.isArray(config.src) ? config.src : [config.src],
            volume: (config.volume ?? this.volume) / 100,
            loop: config.loop || false,
            autoplay: config.autoplay || false,
            onend: config.onEnd,
            onload: config.onLoad,
            onloaderror: (_id, error) => {
                console.error(`Ошибка загрузки звука ${key}:`, error);
                config.onError?.(error);
            }
        });

        this.sounds.set(key, sound);
        return sound;
    }

    // Воспроизведение звука один раз
    playSound(key: string, config?: Partial<SoundConfig>): Howl | null {
        // Останавливаем текущую музыку, если это не фоновый звук
        if (key !== 'thinkingMusic' && this.currentMusic) {
            this.stopMusic();
        }

        let sound = this.sounds.get(key);

        if (!sound && config) {
            sound = this.loadSound(key, {
                ...config,
                loop: false
            } as SoundConfig);
        }

        if (sound) {
            sound.play();
            return sound;
        }

        return null;
    }

    // Воспроизведение фоновой музыки
    playMusic(key: string, config?: Partial<SoundConfig>): Howl | null {
        // Останавливаем текущую музыку, если это другой трек
        if (this.currentMusic && this.currentMusicKey !== key) {
            this.currentMusic.stop();
            this.currentMusic = null;
            this.currentMusicKey = null;
        }

        // Если эта же музыка уже играет, не запускаем снова
        if (this.currentMusic && this.currentMusicKey === key && this.musicPlaying) {
            return this.currentMusic;
        }

        let sound = this.sounds.get(key);

        if (!sound && config) {
            sound = this.loadSound(key, {
                ...config,
                loop: true
            } as SoundConfig);
        }

        if (sound) {
            this.currentMusic = sound;
            this.currentMusicKey = key;
            this.musicPlaying = true;
            sound.play();
            return sound;
        }

        return null;
    }

    // Остановка фоновой музыки
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
            this.currentMusicKey = null;
            this.musicPlaying = false;
        }
    }

    // Остановка конкретного звука
    stop(key: string) {
        const sound = this.sounds.get(key);
        if (sound) {
            sound.stop();
            if (key === this.currentMusicKey) {
                this.currentMusic = null;
                this.currentMusicKey = null;
                this.musicPlaying = false;
            }
        }
    }

    // Установка громкости для всех звуков
    setVolume(volume: number) {
        this.volume = volume;
        Howler.volume(volume / 100);
    }

    // Очистка загруженных звуков
    unloadAll() {
        this.sounds.forEach(sound => sound.unload());
        this.sounds.clear();
        this.currentMusic = null;
        this.currentMusicKey = null;
        this.musicPlaying = false;
    }

    // Проверка, воспроизводится ли звук
    isPlaying(key: string): boolean {
        if (key === this.currentMusicKey && this.musicPlaying) {
            return true;
        }
        const sound = this.sounds.get(key);
        return sound ? sound.playing() : false;
    }

    // Проверка, играет ли музыка
    isMusicPlaying(): boolean {
        return this.musicPlaying;
    }

    // Получение текущего ключа музыки
    getCurrentMusicKey(): string | null {
        return this.currentMusicKey;
    }
}

export const soundManager = SoundManager.getInstance();