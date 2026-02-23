export const useEnv = () => {
    return {
        baseUrl: import.meta.env.BASE_URL,
        mode: import.meta.env.MODE,
        isDev: import.meta.env.DEV,
        isProd: import.meta.env.PROD,
        appTitle: import.meta.env.VITE_APP_TITLE || 'Караоке Игра'
    };
};