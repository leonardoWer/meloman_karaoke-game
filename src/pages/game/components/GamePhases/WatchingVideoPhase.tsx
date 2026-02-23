import React from 'react';
import './GamePhases.css';
import VideoPlayer from "../../../../components/game/VideoPlayer/VideoPlayer.tsx";
import type {Song} from "../../../../types/game.types.ts";

interface WatchingVideoPhaseProps {
    song: Song;
    onVideoEnd: () => void;
}

const WatchingVideoPhase: React.FC<WatchingVideoPhaseProps> = ({ song, onVideoEnd }) => {
    return (
        <div className="phase-container video-phase">
            <h3>Сейчас играет:</h3>
            <h2 className="current-song">{song.title}</h2>

            <VideoPlayer
                videoUrl={song.videoUrl}
                songTitle={song.title}
                onVideoEnd={onVideoEnd}
                isPlaying={true}
            />
        </div>
    );
};

export default WatchingVideoPhase;