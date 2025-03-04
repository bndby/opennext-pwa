import { Page } from '@/components/Page/Page';
import { Typography } from '@mui/material';
import { IndexDB } from '@/components/IndexDB/IndexDB';

export default function PreparePage() {
    return (
        <Page title="IndexDB">
            <Typography variant="h5">IndexDB</Typography>

            <IndexDB />
        </Page>
    );
}
