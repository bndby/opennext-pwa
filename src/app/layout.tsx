import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ViewTransitions } from 'next-view-transitions';
import MUIProvider from '@/components/MUIProvider';

const APP_NAME = 'PWA App';
const APP_DEFAULT_TITLE = 'My Awesome PWA App';
const APP_TITLE_TEMPLATE = '%s - PWA App';
const APP_DESCRIPTION = 'Best PWA app in the world!';

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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ViewTransitions>
            <html lang="en">
                <head>
                    <meta name="emotion-insertion-point" content="" />
                </head>
                <body className={`antialiased`}>
                    <MUIProvider>{children}</MUIProvider>
                </body>
            </html>
        </ViewTransitions>
    );
}
