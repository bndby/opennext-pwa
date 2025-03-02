import { Page } from '@/components/Page/Page';
import WatchLocation from '@/components/WatchLocation/WatchLocation';
import { Link } from 'next-view-transitions';

export default function MediaPage() {
    return (
        <Page title="Геолокация">
            <h1>Геолокация</h1>

            <p>Пример работы с геолокацией устройства</p>

            <WatchLocation />

            <p>
                <Link href="/">Назад</Link>
            </p>
        </Page>
    );
}
