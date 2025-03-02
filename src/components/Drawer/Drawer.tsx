'use client';

import { Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'next-view-transitions';

import StartIcon from '@mui/icons-material/Start';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';

type DrawerListProps = {
    toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
};

export const DrawerList = ({ toggleDrawer }: DrawerListProps) => (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
        <List>
            <ListItem key={`prepare`} disablePadding>
                <ListItemButton LinkComponent={Link} href="/prepare">
                    <ListItemIcon>
                        <StartIcon />
                    </ListItemIcon>
                    <ListItemText primary={`Подготовка`} />
                </ListItemButton>
            </ListItem>
        </List>
        <ListItem key={`install`} disablePadding>
            <ListItemButton>
                <ListItemIcon>
                    <InstallMobileIcon />
                </ListItemIcon>
                <ListItemText primary={`Install`} />
            </ListItemButton>
        </ListItem>
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
