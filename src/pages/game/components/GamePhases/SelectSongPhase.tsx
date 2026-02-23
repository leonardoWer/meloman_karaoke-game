import React from 'react';
import './GamePhases.css';
import type {Song} from "../../../../types/game.types.ts";

interface SelectSongPhaseProps {
    songs: Song[];
    onSelectSong: (songId: string) => void;
    selectedSongId?: string | null; // ID уже выбранной песни
    currentTeamIndex: number; // 0 или 1
}

const SelectSongPhase: React.FC<SelectSongPhaseProps> = ({
    songs,
    onSelectSong,
    selectedSongId,
    currentTeamIndex,
}) => {
    return (
        <div className="phase-container song-selection">
            <h3>Команда {currentTeamIndex + 1} выбирает песню</h3>
            <div className="songs-list">
                {songs.map((song, index) => {
                    const isSelected = song.id === selectedSongId;
                    const isDisabled = selectedSongId !== null && isSelected;

                    return (
                        <button
                            key={song.id}
                            className={`song-card glass-card ${!isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                            onClick={() => !isDisabled && onSelectSong(song.id)}
                            disabled={isDisabled}
                        >
                            <div className="song-title">{song.title || `Песня ${index + 1}`}</div>
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

export default SelectSongPhase;