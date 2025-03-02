import { Link } from 'next-view-transitions';
import { MediaPWA } from '@/components/MediaPWA/MediaPWA';
import { Page } from '@/components/Page/Page';

export default function MediaPage() {
    return (
        <Page title="Медиа">
            <p>Медиа</p>

            <MediaPWA />

            <p>
                <Link href="/">Назад</Link>
            </p>
        </Page>
    );
}
