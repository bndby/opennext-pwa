import { Link } from 'next-view-transitions';
import InstallPWAButton from '@/components/InstallPWAButton/InstallPWAButton';

export default function InstallPWA() {
    return (
        <div>
            <p>Установка PWA</p>

            <InstallPWAButton />

            <p>
                <Link href="/">Назад</Link>
            </p>
        </div>
    );
}
