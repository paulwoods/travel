import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppBar, Box, Container, createTheme, CssBaseline, ThemeProvider, Toolbar, Typography } from '@mui/material';
import { AddressManager } from './components/AddressManager';

function App() {

    const darkTheme = createTheme({
        colorSchemes: {
            dark: true
        }
    })

    return (
        <ThemeProvider theme={darkTheme} defaultMode="system">
            <CssBaseline />
            <Router>
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{
                                    flexGrow: 1,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                Travel Planner
                            </Typography>
                            <Typography>
                                {import.meta.env.VITE_VERCEL_ENV === 'production' ? null : import.meta.env.VITE_VERCEL_ENV}
                            </Typography>
                        </Toolbar>
                    </AppBar>

                    <Container
                        component="main"
                        sx={{
                            flexGrow: 1,
                            py: 3,
                            px: { xs: 2, sm: 3, md: 4 },
                            maxWidth: { xs: '100%', sm: '600px', md: '900px', lg: '1200px' }
                        }}
                    >
                        <Routes>
                            <Route path="/" element={<AddressManager />} />
                        </Routes>
                    </Container>
                </Box>
            </Router>
        </ThemeProvider>
    );
}

export default App;
