import NFCRead from '@/components/NFC/NFCRead';
import NFCSupport from '@/components/NFC/NFCSupport';
import { Link } from 'next-view-transitions';
import { Page } from '@/components/Page/Page';

export default function NFCPage() {
    return (
        <Page title="NFC">
            <h1>NFC</h1>
            <p>Пример работы с NFC</p>

            <ul>
                <li>
                    <Link href="https://developer.chrome.com/docs/capabilities/nfc?hl=ru">Гайд</Link>
                </li>
                <li>
                    <Link href="https://developer.mozilla.org/en-US/docs/Web/API/NDEFReader">Спецификация</Link>
                </li>
            </ul>

            <NFCSupport />

            <NFCRead />

            <Link href="/">Назад</Link>
        </Page>
    );
}
