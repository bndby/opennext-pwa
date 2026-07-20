import type { NextConfig } from 'next';
import withPWAInit from '@ducanh2912/next-pwa';
import { execSync } from 'child_process';

function readGitEnv(): Record<string, string> {
    const env: Record<string, string> = {
        NEXT_PUBLIC_BUILD_DATE: new Date().toISOString(),
    };

    try {
        const gitOutput = execSync('git log -1 --format="%H|%ci|%s"', {
            encoding: 'utf8',
            cwd: process.cwd(),
        }).trim();
        const [hash, date, message] = gitOutput.split('|');
        if (hash) {
            env.NEXT_PUBLIC_COMMIT_HASH = hash;
            env.NEXT_PUBLIC_COMMIT_SHORT_HASH = hash.substring(0, 7);
            env.NEXT_PUBLIC_COMMIT_DATE = date || '';
            env.NEXT_PUBLIC_COMMIT_MESSAGE = message || '';
        }
    } catch {
        // git недоступен (CI без .git и т.п.) — оставляем пустые значения
    }

    return env;
}

const gitEnv = readGitEnv();

const withPWA = withPWAInit({
    dest: 'public',
    workboxOptions: {
        disableDevLogs: true,
    },
});

const nextConfig: NextConfig = {
    turbopack: {},
    env: gitEnv,
};

export default withPWA(nextConfig);

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();
