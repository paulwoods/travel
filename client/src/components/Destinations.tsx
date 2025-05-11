import { Typography, Box, Grid, Card, CardContent, CardMedia } from '@mui/material';

const destinations = [
  {
    id: 1,
    name: 'Paris, France',
    image: 'https://source.unsplash.com/random/800x600/?paris',
    description: 'The City of Light awaits with its iconic landmarks and rich culture.'
  },
  {
    id: 2,
    name: 'Tokyo, Japan',
    image: 'https://source.unsplash.com/random/800x600/?tokyo',
    description: 'Experience the perfect blend of tradition and innovation.'
  },
  {
    id: 3,
    name: 'New York, USA',
    image: 'https://source.unsplash.com/random/800x600/?newyork',
    description: 'The city that never sleeps offers endless possibilities.'
  }
];

export const Destinations = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    <Typography 
      variant="h4" 
      gutterBottom
      sx={{ 
        fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
        textAlign: { xs: 'center', sm: 'left' }
      }}
    >
      Popular Destinations
    </Typography>
    
    <Grid container spacing={3}>
      {destinations.map((destination) => (
        <Grid item xs={12} sm={6} md={4} key={destination.id}>
          <Card 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)'
              }
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={destination.image}
              alt={destination.name}
            />
            <CardContent>
              <Typography 
                gutterBottom 
                variant="h6"
                sx={{ 
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                {destination.name}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                {destination.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
); 