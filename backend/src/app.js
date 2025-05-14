const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const {Client} = require('@googlemaps/google-maps-services-js');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Initialize Google Maps client
const mapsClient = new Client({});

// Routes

app.post('/api', async (req, res) => {
    const {addresses} = req.body;
    // console.log('Received addresses:', addresses);


    // Validate input
    if (!Array.isArray(addresses) || addresses.length < 2) {
        return res.status(400).json({
            error: 'At least two addresses are required'
        });
    }

    // Find home address
    const homeAddress = addresses.find(addr => addr.isHome);
    if (!homeAddress) {
        return res.status(400).json({
            error: 'One address must be marked as home'
        });
    }

    // Get waypoints (non-home addresses)
    const waypoints = addresses
        .filter(addr => !addr.isHome)
        .map(addr => addr.text)
    ;

    // Calculate route using Google Maps Directions API

    const obj = {
        params: {
            key: process.env.GOOGLE_API_KEY,
            origin: homeAddress.text,
            destination: homeAddress.text,
            travelMode: 'driving',
            waypoints,
            optimize: true,
        }
    }

    mapsClient.directions(obj)
        .then(response => response.data)

        .then(data => {

            const route = data.routes[0];
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

        })

        .catch(error => {
            console.error(error)

            if (error.response) {
                // the server responsed
                res.status(error.response.status).json({
                    error: 'Could not calculate route',
                    details: error.response.data.error_message
                });

            } else if (error.request) {
                // the  server didn't send a response
                res.status(500).json({
                    error: 'Could not calculate route',
                    details: error.request
                });
            } else {
                // unknown error
                res.status(500).json({
                    error: 'Could not calculate route',
                    details: error.message
                });
            }
        });

})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({message: 'Something went wrong!'});
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 