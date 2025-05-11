import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#2E3B55',
}));

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const NavButton = styled(Button)(({ theme }) => ({
  color: 'white',
  marginLeft: theme.spacing(2),
}));

// Placeholder components
const Home = () => (
  <Container maxWidth="md" sx={{ mt: 4 }}>
    <Typography variant="h4" gutterBottom>
      Welcome to Travel Explorer
    </Typography>
    <Typography variant="body1">
      Discover amazing destinations and plan your next adventure with us.
    </Typography>
  </Container>
);

const Destinations = () => (
  <Container maxWidth="md" sx={{ mt: 4 }}>
    <Typography variant="h4" gutterBottom>
      Popular Destinations
    </Typography>
    <Typography variant="body1">
      Explore our curated list of amazing travel destinations.
    </Typography>
  </Container>
);

const About = () => (
  <Container maxWidth="md" sx={{ mt: 4 }}>
    <Typography variant="h4" gutterBottom>
      About Us
    </Typography>
    <Typography variant="body1">
      We're passionate about helping you discover the world's most beautiful places.
    </Typography>
  </Container>
);

function App() {
  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <StyledAppBar position="static">
          <StyledToolbar>
            <Typography variant="h6" component="div">
              Travel Explorer
            </Typography>
            <Box>
              <NavButton component={Link} to="/">
                Home
              </NavButton>
              <NavButton component={Link} to="/destinations">
                Destinations
              </NavButton>
              <NavButton component={Link} to="/about">
                About
              </NavButton>
            </Box>
          </StyledToolbar>
        </StyledAppBar>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
