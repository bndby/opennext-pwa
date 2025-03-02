import { AppBar, Paper, Toolbar, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';
import { DrawerMenu } from '../Drawer/Drawer';

type PageProps = PropsWithChildren<{
    title: string;
}>;

export const Page = ({ children, title }: PageProps) => {
    return (
        <>
            <Paper square sx={{ flexGrow: 1, padding: 2 }}>
                {children}
            </Paper>
            <AppBar position="fixed" sx={{ top: 'auto', bottom: 0 }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {title}
                    </Typography>
                    <DrawerMenu />
                </Toolbar>
            </AppBar>
        </>
    );
};
