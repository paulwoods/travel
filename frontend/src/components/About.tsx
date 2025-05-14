import { Typography, Box, Paper } from '@mui/material';

export const About = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    <Typography 
      variant="h4" 
      gutterBottom
      sx={{ 
        fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
        textAlign: { xs: 'center', sm: 'left' }
      }}
    >
      About Us
    </Typography>

    <Paper 
      elevation={2} 
      sx={{ 
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 2
      }}
    >
      <Typography 
        variant="body1" 
        paragraph
        sx={{ 
          fontSize: { xs: '1rem', sm: '1.1rem' },
          lineHeight: 1.6
        }}
      >
        Welcome to Travel Planner, your ultimate companion for organizing and planning your travel adventures. We're passionate about making travel planning easier and more enjoyable for everyone.
      </Typography>

      <Typography 
        variant="body1" 
        paragraph
        sx={{ 
          fontSize: { xs: '1rem', sm: '1.1rem' },
          lineHeight: 1.6
        }}
      >
        Our mission is to help you discover the world's most beautiful places while providing tools to manage your travel plans efficiently. Whether you're planning a weekend getaway or a month-long expedition, we've got you covered.
      </Typography>

      <Typography 
        variant="body1"
        sx={{ 
          fontSize: { xs: '1rem', sm: '1.1rem' },
          lineHeight: 1.6
        }}
      >
        With features like address management, destination exploration, and travel planning tools, we aim to make your travel experience seamless and memorable.
      </Typography>
    </Paper>
  </Box>
); 