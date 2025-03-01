import { Link } from 'next-view-transitions';
import { Page } from '@/components/Page/Page';
export default function PreparePage() {
    return (
        <Page title="Подготовка">
            <p>Подготовка</p>

            <ol>
                <li>
                    <Link href="https://ducanh-next-pwa.vercel.app/docs/next-pwa/configuring">Next-PWA</Link>
                </li>
            </ol>

            <p>
                <Link href="/">Назад</Link>
            </p>
        </Page>
    );
}
