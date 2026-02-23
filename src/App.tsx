import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';

import SetupPage from './pages/setup/SetupPage';
import GamePage from './pages/game/GamePage';
import ResultsPage from './pages/res/ResultsPage';

import './styles/main.css'

// Для GitHub Pages определяем базовый путь
const getBasename = () => {
    const basePath = import.meta.env.BASE_URL;
    return basePath !== '/' ? basePath : '';
};

function App() {
  return (
    <Provider store={store}>
        <Router  basename={getBasename()}>
            <Routes>
                <Route path="/" element={<Navigate to="/setup" replace />} />
                <Route path="/setup" element={<SetupPage />} />
                <Route path="/game" element={<GamePage />} />
                <Route path="/results" element={<ResultsPage />} />
            </Routes>
        </Router>
    </Provider>
  )
}

export default App
