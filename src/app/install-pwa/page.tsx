import { Link } from 'next-view-transitions';
import InstallPWAButton from '@/components/InstallPWAButton/InstallPWAButton';
import { Page } from '@/components/Page/Page';

export default function InstallPWA() {
    return (
        <Page title="Установка PWA">
            <p>Установка PWA</p>

            <InstallPWAButton />

            <p>
                <Link href="/">Назад</Link>
            </p>
        </Page>
    );
}
