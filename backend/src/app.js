const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Client } = require('@googlemaps/google-maps-services-js');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Google Maps client
const mapsClient = new Client({});

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Travel API' });
});

// Path calculation endpoint
app.post('/api/path', async (req, res) => {
  try {
    const { addresses } = req.body;

    // Validate input
    if (!Array.isArray(addresses) || addresses.length < 2) {
      return res.status(400).json({ 
        error: 'At least two addresses are required' 
      });
    }

    // Find home addresses
    const homeAddresses = addresses.filter(addr => addr.isHome);
    if (homeAddresses.length !== 1) {
      return res.status(400).json({ 
        error: 'Only one addresses must be marked as home' 
      });
    }

    // Set origin and destination as home addresses
    const origin = homeAddresses[0].address;
    const destination = homeAddresses[0].address;

    // Get waypoints (non-home addresses)
    const waypoints = addresses
      .filter(addr => !addr.isHome)
      .map(addr => ({
        location: addr.address,
        stopover: true
      }));

    // Calculate route using Google Maps Directions API
    const response = await mapsClient.directions({
      params: {
        origin,
        destination,
        waypoints,
        optimize: true,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status !== 'OK') {
      return res.status(400).json({ 
        error: 'Could not calculate route',
        details: response.data.status
      });
    }

    const route = response.data.routes[0];
    const optimizedWaypoints = route.waypoint_order.map(index => waypoints[index]);

    // Format response
    const result = {
      distance: route.legs.reduce((total, leg) => total + leg.distance.value, 0),
      duration: route.legs.reduce((total, leg) => total + leg.duration.value, 0),
      waypointOrder: route.waypoint_order,
      steps: route.legs.map(leg => ({
        distance: leg.distance,
        duration: leg.duration,
        startAddress: leg.start_address,
        endAddress: leg.end_address,
        steps: leg.steps.map(step => ({
          instruction: step.html_instructions,
          distance: step.distance,
          duration: step.duration
        }))
      }))
    };

    res.json(result);
  } catch (error) {
    console.error('Error calculating path:', error);
    res.status(500).json({ 
      error: 'Failed to calculate path',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 