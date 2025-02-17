import WatchLocation from '@/components/WatchLocation/WatchLocation';
import { Link } from 'next-view-transitions';

export default function MediaPage() {
    return (
        <div>
            <h1>Geolocation</h1>

            <WatchLocation />

            <p>
                <Link href="/">Back</Link>
            </p>
        </div>
    );
}
