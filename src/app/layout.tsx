import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ViewTransitions } from 'next-view-transitions';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Roboto } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
});

const APP_NAME = 'OpenNext PWA';
const APP_DEFAULT_TITLE = 'OpenNext PWA';
const APP_TITLE_TEMPLATE = '%s - OpenNext PWA';
const APP_DESCRIPTION = 'OpenNext PWA';

export const metadata: Metadata = {
    applicationName: APP_NAME,
    title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: APP_DEFAULT_TITLE,
        // startUpImage: [],
    },
    formatDetection: {
        telephone: false,
    },
    openGraph: {
        type: 'website',
        siteName: APP_NAME,
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
    },
    twitter: {
        card: 'summary',
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
    },
};

export const viewport: Viewport = {
    themeColor: '#FFFFFF',
};

export default function RootLayout(props: { children: React.ReactNode }) {
    return (
        <ViewTransitions>
            <html lang="ru" className={roboto.variable}>
                <head>
                    <meta name="emotion-insertion-point" content="" />
                </head>
                <body className="antialiased">
                    <AppRouterCacheProvider>
                        <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
                    </AppRouterCacheProvider>
                </body>
            </html>
        </ViewTransitions>
    );
}
