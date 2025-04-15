import { Page } from '@/components/Page/Page';
import WatchLocation from '@/components/WatchLocation/WatchLocation';
import { Typography } from '@mui/material';

export default function MediaPage() {
    return (
        <Page title="Геолокация">
            <Typography variant="h5">Геолокация</Typography>

            <p>Пример работы с геолокацией устройства</p>

            <WatchLocation />

            <p>
                Для отрисовки карт используется библиотека <a href="https://openlayers.org/">OpenLayers</a> и
                реакт-обертка <a href="https://mmomtchev.github.io/rlayers/">RLayers</a>
            </p>

            <p>
                x2 тайлы для отрисовки карт взяты из <a href="https://stadiamaps.com/">StadiaMap</a>
            </p>
        </Page>
    );
}
