import { execSync } from 'child_process';

export interface GitCommitInfo {
    hash: string;
    shortHash: string;
    date: string;
    message: string;
    formattedDate: string;
}

function formatCommitDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Информация о коммите из env (задаётся при сборке в next.config).
 * Работает и на Cloudflare Workers, где git/execSync недоступны.
 */
export function getBuildCommitInfo(): GitCommitInfo | null {
    const hash = process.env.NEXT_PUBLIC_COMMIT_HASH || '';
    const shortHash = process.env.NEXT_PUBLIC_COMMIT_SHORT_HASH || hash.substring(0, 7);
    const date = process.env.NEXT_PUBLIC_COMMIT_DATE || '';
    const message = process.env.NEXT_PUBLIC_COMMIT_MESSAGE || '';

    if (!shortHash) {
        return null;
    }

    return {
        hash: hash || shortHash,
        shortHash,
        date,
        message,
        formattedDate: date ? formatCommitDate(date) : process.env.NEXT_PUBLIC_BUILD_DATE || '',
    };
}

/**
 * Получает информацию о последнем Git коммите через git CLI.
 * Только для локального Node (dev / build), не для Workers runtime.
 */
export function getGitCommitInfo(): GitCommitInfo | null {
    try {
        if (typeof window !== 'undefined') {
            return null;
        }

        const gitOutput = execSync('git log -1 --format="%H|%ci|%s"', {
            encoding: 'utf8',
            cwd: process.cwd(),
        }).trim();

        const [hash, dateString, message] = gitOutput.split('|');

        if (!hash || !dateString) {
            return null;
        }

        return {
            hash,
            shortHash: hash.substring(0, 7),
            date: dateString,
            message: message || '',
            formattedDate: formatCommitDate(dateString),
        };
    } catch {
        return null;
    }
}

/**
 * Предпочитает build-time env, иначе пробует git (локально).
 */
export function resolveCommitInfo(): GitCommitInfo | null {
    return getBuildCommitInfo() || getGitCommitInfo();
}

/** @deprecated используйте getBuildCommitInfo / resolveCommitInfo */
export const BUILD_INFO = {
    COMMIT_HASH: process.env.NEXT_PUBLIC_COMMIT_HASH || '',
    COMMIT_SHORT_HASH: process.env.NEXT_PUBLIC_COMMIT_SHORT_HASH || '',
    COMMIT_DATE: process.env.NEXT_PUBLIC_COMMIT_DATE || '',
    BUILD_DATE: process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString(),
};
