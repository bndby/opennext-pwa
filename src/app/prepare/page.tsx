import { Link } from 'next-view-transitions';
import { Page } from '@/components/Page/Page';
import { Typography } from '@mui/material';

export default function PreparePage() {
    return (
        <Page title="Подготовка">
            <Typography variant="h5">Подготовка</Typography>

            <ol>
                <li>
                    <Link href="https://ducanh-next-pwa.vercel.app/docs/next-pwa/configuring">Next-PWA</Link>
                </li>
            </ol>
        </Page>
    );
}
