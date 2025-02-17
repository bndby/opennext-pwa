import { Link } from "next-view-transitions";

export default function PreparePage() {
    return (
        <div>
            <p>Prepare</p>

            <ol>
                <li>
                    <Link href="https://ducanh-next-pwa.vercel.app/docs/next-pwa/configuring">Next-PWA</Link>
                </li>
            </ol>

            <p>
                <Link href="/">Back</Link>
            </p>
        </div>
    )
}