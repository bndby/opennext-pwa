import InstallPWAButton from '@/components/InstallPWAButton/InstallPWAButton';
import { Page } from '@/components/Page/Page';
import { Typography, Box, Card, CardContent, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
    CloudOff as OfflineIcon,
    Speed as SpeedIcon,
    Home as HomeIcon,
    Security as SecurityIcon,
} from '@mui/icons-material';

export default function InstallPWA() {
    return (
        <Page title="Установка PWA">
            <Typography variant="h5" gutterBottom>
                Установка PWA
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Progressive Web App (PWA) - это веб-приложение, которое работает как обычное мобильное приложение
            </Typography>

            <InstallPWAButton />

            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Преимущества PWA приложения
                </Typography>

                <Card variant="outlined" sx={{ mt: 2 }}>
                    <CardContent>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <OfflineIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Работа без интернета"
                                    secondary="Приложение может работать в автономном режиме благодаря кешированию"
                                />
                            </ListItem>

                            <ListItem>
                                <ListItemIcon>
                                    <SpeedIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Быстрая загрузка"
                                    secondary="Мгновенная загрузка благодаря кешированию ресурсов"
                                />
                            </ListItem>

                            <ListItem>
                                <ListItemIcon>
                                    <HomeIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Иконка на главном экране"
                                    secondary="Добавьте приложение на главный экран для быстрого доступа"
                                />
                            </ListItem>

                            <ListItem>
                                <ListItemIcon>
                                    <SecurityIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Безопасность"
                                    secondary="Работает только по HTTPS и имеет изолированное окружение"
                                />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Box>
        </Page>
    );
}
