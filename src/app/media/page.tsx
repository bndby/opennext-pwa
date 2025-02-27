import { Link } from 'next-view-transitions';
import { MediaPWA } from '@/components/MediaPWA/MediaPWA';

export default function MediaPage() {
    return (
        <div>
            <p>Медиа</p>

            <MediaPWA />

            <p>
                <Link href="/">Назад</Link>
            </p>
        </div>
    );
}
