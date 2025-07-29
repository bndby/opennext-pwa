'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '@/lib/emotion';
import { CssBaseline } from '@mui/material';
import { ReactNode } from 'react';

const theme = createTheme({
    palette: {
        mode: 'light',
    },
});

const clientSideEmotionCache = createEmotionCache();

interface MUIProviderProps {
    children: ReactNode;
}

export default function MUIProvider({ children }: MUIProviderProps) {
    return (
        <CacheProvider value={clientSideEmotionCache}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </CacheProvider>
    );
}
