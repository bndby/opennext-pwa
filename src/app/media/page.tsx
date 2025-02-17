import { Link } from "next-view-transitions";
import { MediaPWA } from "@/components/MediaPWA/MediaPWA";

export default function MediaPage() {
    return (
        <div>
            <p>Media</p>

            <MediaPWA />

            <p>
                <Link href="/">Back</Link>
            </p>
        </div>
    )
}