import { Link } from 'next-view-transitions';
import FSSupport from '@/components/FileSystem/FSSupport';
import FSOpenText from '@/components/FileSystem/FSOpenText';
import FSOpenDir from '@/components/FileSystem/FSOpenDir';
import { Page } from '@/components/Page/Page';

export default function FileSystemPage() {
    return (
        <Page title="Файловая система устройства">
            <h1>Файловая система устройства</h1>
            <p>Пример работы с локальной файловой системой устройства</p>

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

            <FSSupport />

            <FSOpenText />

            <FSOpenDir />

            <Link href="/">Назад</Link>
        </Page>
    );
}
