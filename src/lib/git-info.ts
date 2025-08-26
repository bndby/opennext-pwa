import { execSync } from 'child_process';

export interface GitCommitInfo {
    hash: string;
    shortHash: string;
    date: string;
    message: string;
    formattedDate: string;
}

/**
 * Получает информацию о последнем Git коммите
 * Работает только на сервере (build time)
 */
export function getGitCommitInfo(): GitCommitInfo | null {
    try {
        // Проверяем, что мы не в браузере
        if (typeof window !== 'undefined') {
            return null;
        }

        // Получаем информацию о последнем коммите
        const gitOutput = execSync('git log -1 --format="%H|%ci|%s"', {
            encoding: 'utf8',
            cwd: process.cwd(),
        }).trim();

        const [hash, dateString, message] = gitOutput.split('|');

        if (!hash || !dateString) {
            return null;
        }

        const shortHash = hash.substring(0, 7);
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });

        return {
            hash,
            shortHash,
            date: dateString,
            message: message || '',
            formattedDate,
        };
    } catch (error) {
        console.warn('Не удалось получить информацию о Git коммите:', error);
        return null;
    }
}

/**
 * Статическая информация о коммите для клиентской стороны
 * Эта информация должна быть установлена во время сборки
 */
export const BUILD_INFO = {
    // Эти значения будут заменены во время сборки
    COMMIT_HASH: process.env.NEXT_PUBLIC_COMMIT_HASH || '',
    COMMIT_SHORT_HASH: process.env.NEXT_PUBLIC_COMMIT_SHORT_HASH || '',
    COMMIT_DATE: process.env.NEXT_PUBLIC_COMMIT_DATE || '',
    BUILD_DATE: process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString(),
};
