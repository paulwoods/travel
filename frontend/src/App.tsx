import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, Box, useTheme, useMediaQuery } from '@mui/material';
import { Home } from './components/Home';
import { Destinations } from './components/Destinations';
import { About } from './components/About';
import { AddressManager } from './components/AddressManager';

const NavButton = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Button
    component={Link}
    to={to}
    sx={{
      color: 'white',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
    }}
  >
    {children}
  </Button>
);

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'stretch' : 'center'
            }}>
              <NavButton to="/">Home</NavButton>
              <NavButton to="/destinations">Destinations</NavButton>
              <NavButton to="/addresses">Addresses</NavButton>
              <NavButton to="/about">About</NavButton>
            </Box>
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
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/addresses" element={<AddressManager />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
