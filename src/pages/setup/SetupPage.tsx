import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import GameSettings from "../../components/admin/GameSettings.tsx";
import RoundSetup from "../../components/admin/RoundSetup.tsx";
import SoundSettings from "../../components/admin/sound/SoundSettings.tsx";
import Layout from "../../components/common/Layout/Layout.tsx";
import {setGamePhase} from "../../store/slices/gameSlice.ts";
import {useAppDispatch} from "../../hooks/reduxHooks.ts";

import './../Pages.css';

const SetupPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const tabs = ['Общие настройки', 'Раунды', 'Звуки'];

    const handleStartGame = () => {
        dispatch(setGamePhase('selection-question'));
        navigate('/game');
    };

    return (
        <Layout title="Настройка игры">
            <div className="setup-page">
                <div className="tabs">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab}
                            className={`tab ${activeTab === index ? 'active' : ''}`}
                            onClick={() => setActiveTab(index)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="tab-content">
                    {activeTab === 0 && <GameSettings />}
                    {activeTab === 1 && <RoundSetup />}
                    {activeTab === 2 && <SoundSettings />}
                </div>

                <div className="setup-actions">
                    <button className="btn btn-outline" onClick={() => navigate('/')}>
                        Отмена
                    </button>
                    <button className="btn" onClick={handleStartGame}>
                        Начать игру
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default SetupPage;