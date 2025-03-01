import { Link } from 'next-view-transitions';
import { Page } from '@/components/Page/Page';
export default function Home() {
    return (
        <Page title="Opennext Cloudflare PWA">
            <h1>Opennext Cloudflare PWA</h1>

            <p>
                <Link href="/prepare">Подготовка</Link>
            </p>

            <p>
                <Link href="/install-pwa">Установка PWA</Link>
            </p>

            <p>
                <Link href="/media">Медиа</Link>
            </p>

            <p>
                <Link href="/geolocation">Геолокация</Link>
            </p>

            <p>
                <Link href="/file-system">Файловая система</Link>
            </p>

            <p>
                <Link href="/nfc">NFC</Link>
            </p>
        </Page>
    );
}
