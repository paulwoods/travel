import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {AppBar, Box, Container, Toolbar, Typography, useMediaQuery, useTheme} from '@mui/material';
import {AddressManager} from './components/AddressManager';

function App() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Router>
            <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                flexGrow: 1,
                                fontSize: isMobile ? '1rem' : '1.25rem',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            Travel Planner
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Container
                    component="main"
                    sx={{
                        flexGrow: 1,
                        py: 3,
                        px: {xs: 2, sm: 3, md: 4},
                        maxWidth: {xs: '100%', sm: '600px', md: '900px', lg: '1200px'}
                    }}
                >
                    <Routes>
                        <Route path="/" element={<AddressManager/>}/>
                    </Routes>
                </Container>
            </Box>
        </Router>
    );
}

export default App;
