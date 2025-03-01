import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';
import { DrawerMenu } from '../Drawer/Drawer';

type PageProps = PropsWithChildren<{
    title: string;
}>;

export const Page = ({ children, title }: PageProps) => {
    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <DrawerMenu />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {title}
                        </Typography>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
            </Box>
            {children}
        </>
    );
};
