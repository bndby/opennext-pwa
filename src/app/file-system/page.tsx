import { Link } from 'next-view-transitions';
import FSSupport from '@/components/FileSystem/FSSupport';
import FSOpenText from '@/components/FileSystem/FSOpenText';
import FSOpenDir from '@/components/FileSystem/FSOpenDir';
import { Page } from '@/components/Page/Page';
import { Typography } from '@mui/material';

export default function FileSystemPage() {
    return (
        <Page title="Файловая система устройства">
            <Typography variant="h5">Файловая система устройства</Typography>

            <FSSupport />

            <Typography variant="body1">Пример работы с локальной файловой системой устройства</Typography>

            <ul>
                <li>
                    <Link href="https://developer.chrome.com/docs/capabilities/web-apis/file-system-access?hl=ru">
                        Гайд
                    </Link>
                </li>
                <li>
                    <Link href="https://wicg.github.io/file-system-access/">Спецификация</Link>
                </li>
            </ul>

            <Typography variant="body1">Открытие текстового файла:</Typography>

            <FSOpenText />

            <Typography variant="body1">Открытие папки:</Typography>

            <FSOpenDir />
        </Page>
    );
}
