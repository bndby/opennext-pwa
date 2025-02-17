import { Link } from "next-view-transitions";
import InstallPWAButton from "@/components/InstallPWAButton/InstallPWAButton";

export default function InstallPWA() {
    return (
        <div>
            <p>Install PWA</p>

            <InstallPWAButton />

            <p>
                <Link href="/">Back</Link>
            </p>
        </div>
    )
}