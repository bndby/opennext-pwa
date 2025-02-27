import { Link } from 'next-view-transitions';

export default function Home() {
    return (
        <div>
            <h1>Opennext PWA</h1>

            <p>
                <Link href="/prepare">Prepare</Link>
            </p>

            <p>
                <Link href="/install-pwa">Install PWA</Link>
            </p>

            <p>
                <Link href="/media">Media</Link>
            </p>

            <p>
                <Link href="/geolocation">Geolocation</Link>
            </p>

            <p>
                <Link href="/file-system">File System</Link>
            </p>
        </div>
    );
}
