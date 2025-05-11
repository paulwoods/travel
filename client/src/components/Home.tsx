import { Typography, Container, Box } from '@mui/material';

export const Home = () => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 2,
    textAlign: { xs: 'center', sm: 'left' }
  }}>
    <Typography 
      variant="h4" 
      gutterBottom
      sx={{ 
        fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
      }}
    >
      Welcome to Travel Planner
    </Typography>
    <Typography 
      variant="body1"
      sx={{ 
        fontSize: { xs: '1rem', sm: '1.1rem' },
        maxWidth: '800px'
      }}
    >
      Discover amazing destinations and plan your next adventure with us. Our platform helps you organize your travel plans, manage addresses, and explore new places with ease.
    </Typography>
  </Box>
); 