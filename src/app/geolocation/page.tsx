import WatchLocation from '@/components/WatchLocation/WatchLocation';
import { Link } from 'next-view-transitions';

export default function MediaPage() {
    return (
        <div>
            <h1>Геолокация</h1>

            <p>Пример работы с геолокацией устройства</p>

            <WatchLocation />

            <p>
                <Link href="/">Назад</Link>
            </p>
        </div>
    );
}
