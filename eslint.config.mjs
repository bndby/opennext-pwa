import nextConfig from 'eslint-config-next';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        ignores: [
            '**/.next/**',
            '**/.open-next/**',
            '**/public/**',
            '**/certificates/**',
            '**/node_modules/**',
            '**/cloudflare-env.d.ts',
            '**/tsconfig.tsbuildinfo',
            '**/*.config.*',
        ],
    },
    ...nextConfig,
    ...nextCoreWebVitals,
    ...nextTypescript,
    {
        rules: {
            'react-hooks/set-state-in-effect': 'off',
        },
    },
];
