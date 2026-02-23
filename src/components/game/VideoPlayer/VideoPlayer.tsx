import React, { useEffect, useRef, useState } from 'react';
import './VideoPlayer.css';

interface VideoPlayerProps {
    videoUrl: string;
    songTitle: string;
    onVideoEnd: () => void;
    isPlaying: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
     videoUrl,
     songTitle,
     onVideoEnd,
     isPlaying
 }) => {
    const [playerReady, setPlayerReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const youtubePlayerRef = useRef<any>(null);

    // Определяем тип видео по ссылке
    const getVideoType = (url: string): 'youtube' | 'google-drive' | 'unknown' => {
        if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('youtube.com/embed')) {
            return 'youtube';
        }
        if (url.includes('drive.google.com') || url.includes('googleusercontent.com')) {
            return 'google-drive';
        }
        return 'unknown';
    };

    // Получаем ID видео из ссылки на YouTube
    const getYouTubeVideoId = (url: string): string | null => {
        // Поддерживаемые форматы:
        // - https://www.youtube.com/watch?v=VIDEO_ID
        // - https://youtu.be/VIDEO_ID
        // - https://www.youtube.com/embed/VIDEO_ID
        // - https://www.youtube.com/v/VIDEO_ID

        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Получаем embed-ссылку для Google Drive
    const getGoogleDriveEmbedUrl = (url: string): string | null => {
        // Поддерживаемые форматы:
        // - https://drive.google.com/file/d/FILE_ID/view
        // - https://drive.google.com/file/d/FILE_ID/preview
        // - https://drive.google.com/open?id=FILE_ID
        // - https://docs.google.com/file/d/FILE_ID/edit

        const patterns = [
            /\/file\/d\/([a-zA-Z0-9_-]+)/,
            /id=([a-zA-Z0-9_-]+)/,
            /\/open\?id=([a-zA-Z0-9_-]+)/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return `https://drive.google.com/file/d/${match[1]}/preview`;
            }
        }

        // Если ссылка уже в формате preview, используем её как есть
        if (url.includes('/preview')) {
            return url;
        }

        return null;
    };

    // Загружаем YouTube API если нужно
    useEffect(() => {
        if (getVideoType(videoUrl) === 'youtube' && !window.YT) {
            loadYouTubeAPI();
        }
    }, [videoUrl]);

    const loadYouTubeAPI = () => {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
            setPlayerReady(true);
        };
    };

    // Инициализация YouTube плеера
    useEffect(() => {
        if (getVideoType(videoUrl) !== 'youtube' || !playerReady) return;

        const videoId = getYouTubeVideoId(videoUrl);
        if (!videoId) return;

        // Если плеер уже существует, удаляем его
        if (youtubePlayerRef.current) {
            youtubePlayerRef.current.destroy();
        }

        // Создаем новый плеер
        youtubePlayerRef.current = new window.YT.Player('youtube-player', {
            videoId: videoId,
            playerVars: {
                autoplay: 1,
                controls: 1,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                fs: 1,
                iv_load_policy: 3
            },
            events: {
                onReady: (event: any) => {
                    console.log('YouTube плеер готов');
                    if (isPlaying) {
                        event.target.playVideo();
                    }
                },
                onStateChange: (event: any) => {
                    // Состояние 0 означает, что видео закончилось
                    if (event.data === 0) {
                        onVideoEnd();
                    }
                },
                onError: (event: any) => {
                    console.error('Ошибка YouTube плеера:', event.data);
                    setError('Ошибка воспроизведения видео');
                }
            }
        });
    }, [videoUrl, playerReady, isPlaying, onVideoEnd]);

    // Управление воспроизведением для YouTube
    useEffect(() => {
        if (!youtubePlayerRef.current || getVideoType(videoUrl) !== 'youtube') return;

        if (isPlaying) {
            youtubePlayerRef.current.playVideo();
        } else {
            youtubePlayerRef.current.pauseVideo();
        }
    }, [isPlaying, videoUrl]);

    // Очистка при размонтировании
    useEffect(() => {
        return () => {
            if (youtubePlayerRef.current) {
                youtubePlayerRef.current.destroy();
            }
        };
    }, []);

    // Рендерим видео в зависимости от типа
    const renderVideo = () => {
        const videoType = getVideoType(videoUrl);

        switch (videoType) {
            case 'youtube': {
                const videoId = getYouTubeVideoId(videoUrl);
                if (!videoId) {
                    return <div className="error-message">Неверная ссылка на YouTube</div>;
                }

                return (
                    <div className="youtube-container">
                        <div id="youtube-player" className="youtube-player" />
                    </div>
                );
            }

            case 'google-drive': {
                const embedUrl = getGoogleDriveEmbedUrl(videoUrl);
                if (!embedUrl) {
                    return <div className="error-message">Неверная ссылка на Google Drive</div>;
                }

                return (
                    <iframe
                        src={embedUrl}
                        width="100%"
                        height="100%"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        title={songTitle}
                        onError={() => setError('Ошибка загрузки видео с Google Drive')}
                    />
                );
            }

            default:
                return (
                    <div className="video-placeholder">
                        <div className="placeholder-content">
                            <span className="placeholder-icon">🎵</span>
                            <h3>{songTitle}</h3>
                            <p className="error-message">
                                Неподдерживаемый формат видео или ссылка
                            </p>
                            <p className="url-display">{videoUrl}</p>
                            <a
                                href={videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-glass"
                            >
                                Открыть видео в новой вкладке
                            </a>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="video-player-container" ref={containerRef}>
            <div className="video-wrapper glass-card">
                {error ? (
                    <div className="video-placeholder">
                        <div className="placeholder-content">
                            <span className="placeholder-icon error">❌</span>
                            <h3>Ошибка воспроизведения</h3>
                            <p className="error-message">{error}</p>
                            <button
                                className="btn btn-glass"
                                onClick={() => {
                                    setError(null);
                                    // Перезагружаем плеер
                                    if (youtubePlayerRef.current) {
                                        youtubePlayerRef.current.destroy();
                                        youtubePlayerRef.current = null;
                                    }
                                }}
                            >
                                Попробовать снова
                            </button>
                        </div>
                    </div>
                ) : (
                    renderVideo()
                )}
            </div>

            <div className="video-controls">
                {getVideoType(videoUrl) === 'google-drive' && (
                    <a
                        href={videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-glass"
                        title="Открыть видео на Google Drive"
                    >
                        📁 Открыть на Google Drive
                    </a>
                )}

                <button
                    className="btn"
                    onClick={onVideoEnd}
                    title="Пропустить видео и перейти к ответам"
                >
                    Далее
                </button>
            </div>
        </div>
    );
};

export default VideoPlayer;