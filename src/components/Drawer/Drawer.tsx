'use client';

import { Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'next-view-transitions';

import StartIcon from '@mui/icons-material/Start';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import HomeIcon from '@mui/icons-material/Home';
import NfcIcon from '@mui/icons-material/Nfc';
import StorageIcon from '@mui/icons-material/Storage';
import ContactsIcon from '@mui/icons-material/Contacts';
import BarchartIcon from '@mui/icons-material/BarChart';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';

type DrawerListProps = {
    toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
};

const MENU = [
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
];

export const DrawerList = ({ toggleDrawer }: DrawerListProps) => (
    <Box sx={{ width: 250, marginTop: 'auto' }} role="presentation" onClick={toggleDrawer(false)}>
        <List>
            <ListItem key={`home`} disablePadding>
                <ListItemButton LinkComponent={Link} href="/">
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary={`Home`} />
                </ListItemButton>
            </ListItem>
        </List>
        <List>
            {MENU.map((item) => (
                <ListItem key={item.label} disablePadding>
                    <ListItemButton LinkComponent={Link} href={item.href}>
                        <ListItemIcon>
                            <item.icon />
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    </Box>
);

export const DrawerMenu = () => {
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };
    return (
        <>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ ml: 2 }}
                onClick={toggleDrawer(true)}
            >
                <MenuIcon />
            </IconButton>
            <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
                <DrawerList toggleDrawer={toggleDrawer} />
            </Drawer>
        </>
    );
};
