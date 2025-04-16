import { Page } from '@/components/Page/Page';
import { Typography } from '@mui/material';
import BarcodeSupport from '@/components/Barcode/BarcodeSupport';

export default function MediaPage() {
    return (
        <Page title="Штрихкоды">
            <Typography variant="h5">Штрихкоды</Typography>

            <BarcodeSupport />

            <p>
                Пример работы со{' '}
                <a href="https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API">штрихкодами</a>.
            </p>
        </Page>
    );
}
