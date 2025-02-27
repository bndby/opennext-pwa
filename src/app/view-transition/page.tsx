import { Link } from 'next-view-transitions';

export default function PreparePage() {
    return (
        <div>
            <p>View Transition</p>

            <ol>
                <li>
                    <Link href="https://next-view-transitions.vercel.app/">Next-View-Transitions</Link>
                </li>
            </ol>

            <p>
                <Link href="/">Назад</Link>
            </p>
        </div>
    );
}
