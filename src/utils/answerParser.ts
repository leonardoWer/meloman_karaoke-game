export interface ParsedAnswer {
    text: string;
    type: 'first' | 'second' | null;
}

/**
 * Парсит строку с ответами в формате:
 * [слово](first) - будет выделено цветом first (аквамариновый)
 * [слово](second) - будет выделено цветом second (фиолетовый)
 *
 * Пример: "Я [люблю](first) [петь](second) караоке"
 */
export const parseAnswerText = (text: string): ParsedAnswer[] => {
    const result: ParsedAnswer[] = [];

    // Регулярное выражение для поиска паттерна [текст](тип)
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;

    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        // Добавляем текст до совпадения
        if (match.index > lastIndex) {
            result.push({
                text: text.substring(lastIndex, match.index),
                type: null
            });
        }

        // Добавляем выделенный текст
        const type = match[2].toLowerCase();
        result.push({
            text: match[1],
            type: type === 'first' ? 'first' : type === 'second' ? 'second' : null
        });

        lastIndex = regex.lastIndex;
    }

    // Добавляем оставшийся текст после последнего совпадения
    if (lastIndex < text.length) {
        result.push({
            text: text.substring(lastIndex),
            type: null
        });
    }

    return result;
};

/**
 * Форматирует текст для отображения в поле ввода
 * Удаляет маркеры [](first) и [](second)
 */
export const formatAnswerForInput = (text: string): string => {
    return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
};

/**
 * Извлекает все выделенные ответы из текста
 */
export const extractMarkedAnswers = (text: string): { text: string; type: string }[] => {
    const answers: { text: string; type: string }[] = [];
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
        answers.push({
            text: match[1],
            type: match[2]
        });
    }

    return answers;
};