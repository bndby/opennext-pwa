'use client';

import { Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'next-view-transitions';
import { MENU } from '../../menu';

type DrawerListProps = {
    toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
};

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
