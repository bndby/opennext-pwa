import { Link } from 'next-view-transitions';
import { Page } from '@/components/Page/Page';

export default function PreparePage() {
    return (
        <Page title="View Transition">
            <p>View Transition</p>

            <ol>
                <li>
                    <Link href="https://next-view-transitions.vercel.app/">Next-View-Transitions</Link>
                </li>
            </ol>

            <p>
                <Link href="/">Назад</Link>
            </p>
        </Page>
    );
}
