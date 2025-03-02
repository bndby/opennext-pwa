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

type DrawerListProps = {
    toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
};

export const DrawerList = ({ toggleDrawer }: DrawerListProps) => (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
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
            <ListItem key={`prepare`} disablePadding>
                <ListItemButton LinkComponent={Link} href="/prepare">
                    <ListItemIcon>
                        <StartIcon />
                    </ListItemIcon>
                    <ListItemText primary={`Prepare`} />
                </ListItemButton>
            </ListItem>
            <ListItem key={`install`} disablePadding>
                <ListItemButton LinkComponent={Link} href="/install">
                    <ListItemIcon>
                        <InstallMobileIcon />
                    </ListItemIcon>
                    <ListItemText primary={`Install`} />
                </ListItemButton>
            </ListItem>
            <ListItem key={`media`} disablePadding>
                <ListItemButton LinkComponent={Link} href="/media">
                    <ListItemIcon>
                        <CameraAltIcon />
                    </ListItemIcon>
                    <ListItemText primary={`Media`} />
                </ListItemButton>
            </ListItem>
            <ListItem key={`geolocation`} disablePadding>
                <ListItemButton LinkComponent={Link} href="/geolocation">
                    <ListItemIcon>
                        <MyLocationIcon />
                    </ListItemIcon>
                    <ListItemText primary={`Geolocation`} />
                </ListItemButton>
            </ListItem>
            <ListItem key={`file-system`} disablePadding>
                <ListItemButton LinkComponent={Link} href="/file-system">
                    <ListItemIcon>
                        <FolderOpenIcon />
                    </ListItemIcon>
                    <ListItemText primary={`File System`} />
                </ListItemButton>
            </ListItem>
            <ListItem key={`nfc`} disablePadding>
                <ListItemButton LinkComponent={Link} href="/nfc">
                    <ListItemIcon>
                        <NfcIcon />
                    </ListItemIcon>
                    <ListItemText primary={`NFC`} />
                </ListItemButton>
            </ListItem>
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
                sx={{ mr: 2 }}
                onClick={toggleDrawer(true)}
            >
                <MenuIcon />
            </IconButton>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                <DrawerList toggleDrawer={toggleDrawer} />
            </Drawer>
        </>
    );
};
