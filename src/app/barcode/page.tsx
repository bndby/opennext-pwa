import { Page } from '@/components/Page/Page';
import { Link as MuiLink, Stack, Typography } from '@mui/material';
import BarcodeSupport from '@/components/Barcode/BarcodeSupport';
import { BarcodeDetect } from '@/components/Barcode/BarcodeDetect';

export default function MediaPage() {
    return (
        <Page title="Штрихкоды">
            <Stack spacing={2}>
                <Typography variant="h5">Штрихкоды</Typography>

                <BarcodeSupport />

                <Typography variant="body1">
                    Пример работы с{' '}
                    <MuiLink
                        href="https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Barcode Detection API
                    </MuiLink>
                    .
                </Typography>

                <BarcodeDetect />
            </Stack>
        </Page>
    );
}
