import React from 'react';
import './GamePhases.css';
import type {Song} from "../../../../types/game.types.ts";

interface SelectSongPhaseProps {
    songs: Song[];
    onSelectSong: (songId: string) => void;
}

const SelectSongPhase: React.FC<SelectSongPhaseProps> = ({ songs, onSelectSong }) => {
    return (
        <div className="phase-container song-selection">
            <h3>Выберите песню</h3>
            <div className="songs-list">
                {songs.map((song, index) => (
                    <button
                        key={song.id}
                        className="song-card glass-card"
                        onClick={() => onSelectSong(song.id)}
                    >
                        <div className="song-title">{song.title || `Песня ${index + 1}`}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SelectSongPhase;