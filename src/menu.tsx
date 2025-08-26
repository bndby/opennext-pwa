import StartIcon from '@mui/icons-material/Start';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import NfcIcon from '@mui/icons-material/Nfc';
import StorageIcon from '@mui/icons-material/Storage';
import ContactsIcon from '@mui/icons-material/Contacts';
import BarchartIcon from '@mui/icons-material/BarChart';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import CellWifiIcon from '@mui/icons-material/CellWifi';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';
import BatteryIcon from '@mui/icons-material/BatteryFull';
import { SvgIconComponent } from '@mui/icons-material';

export interface MenuItem {
    label: string;
    href: string;
    icon: SvgIconComponent;
}

export const MENU: MenuItem[] = [
    {
        label: 'Prepare',
        href: '/prepare',
        icon: StartIcon,
    },
    {
        label: 'Установка',
        href: '/install-pwa',
        icon: InstallMobileIcon,
    },
    {
        label: 'Медиа',
        href: '/media',
        icon: CameraAltIcon,
    },
    {
        label: 'Геолокация',
        href: '/geolocation',
        icon: MyLocationIcon,
    },
    {
        label: 'Файловая система',
        href: '/file-system',
        icon: FolderOpenIcon,
    },
    {
        label: 'NFC',
        href: '/nfc',
        icon: NfcIcon,
    },
    {
        label: 'IndexDB',
        href: '/indexdb',
        icon: StorageIcon,
    },
    {
        label: 'Контакты',
        href: '/contacts',
        icon: ContactsIcon,
    },
    {
        label: 'Штрихкоды',
        href: '/barcode',
        icon: BarchartIcon,
    },
    {
        label: 'Генерация голоса',
        href: '/speech-synthesis',
        icon: RecordVoiceOverIcon,
    },
    {
        label: 'Информация о сети',
        href: '/network-information',
        icon: CellWifiIcon,
    },
    {
        label: 'Акселерометр',
        href: '/device-motion',
        icon: ThreeDRotationIcon,
    },
    {
        label: 'Батарея',
        href: '/battery',
        icon: BatteryIcon,
    },
];
