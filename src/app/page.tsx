import { Page } from '@/components/Page/Page';
import { Typography, Card, CardContent, CardActionArea, Box } from '@mui/material';
import { Link } from 'next-view-transitions';
import { MENU } from '@/menu';
import { VersionInfo } from '@/components/VersionInfo/VersionInfo';
import { getGitCommitInfo } from '@/lib/git-info';

export default function Home() {
    // Получаем информацию о коммите на сервере
    const gitInfo = getGitCommitInfo();
    const commitInfo = gitInfo
        ? {
              shortHash: gitInfo.shortHash,
              formattedDate: gitInfo.formattedDate,
              message: gitInfo.message,
          }
        : null;

    return (
        <Page title="Opennext Cloudflare PWA">
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Opennext Cloudflare PWA
            </Typography>

            <Typography variant="body1" paragraph align="center" sx={{ mb: 4 }}>
                Приложение для демонстрации работы возможностей PWA-приложений на базе фреймворка OpenNext и хостинга
                Cloudflare.
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'repeat(3, 1fr)',
                        sm: 'repeat(3, 1fr)',
                        md: 'repeat(4, 1fr)',
                        lg: 'repeat(5, 1fr)',
                    },
                    gap: { xs: 2, sm: 2, md: 3 },
                }}
            >
                {MENU.map((item) => (
                    <Card
                        key={item.href}
                        sx={{
                            height: '100%',
                            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 3,
                            },
                        }}
                    >
                        <CardActionArea
                            component={Link}
                            href={item.href}
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                padding: { xs: 0.5, sm: 1, md: 1.5 },
                                minHeight: { xs: 80, sm: 90, md: 110 },
                            }}
                        >
                            <CardContent
                                sx={{
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: { xs: 0.5, sm: 0.75, md: 1 },
                                    padding: { xs: '8px', sm: '12px', md: '16px' },
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: 'primary.main',
                                    }}
                                >
                                    <item.icon sx={{ fontSize: { xs: 32, sm: 36, md: 48 } }} />
                                </Box>
                                <Typography
                                    variant="subtitle2"
                                    component="h2"
                                    sx={{
                                        fontWeight: 500,
                                        textAlign: 'center',
                                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                    }}
                                >
                                    {item.label}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
            </Box>

            {/* Информация о версии в футере страницы */}
            <VersionInfo commitInfo={commitInfo} placement="footer" showMessage={false} />
        </Page>
    );
}
