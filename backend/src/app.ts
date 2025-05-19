import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Client, TravelMode } from '@googlemaps/google-maps-services-js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Google Maps client
const mapsClient = new Client({});

// Types
interface Address {
    id: string;
    text: string;
    isSelected: boolean;
    isStart: boolean;
    isDestination: boolean;
}

interface RouteStep {
    instruction: string;
    distance: {
        text: string;
        value: number;
    };
    duration: {
        text: string;
        value: number;
    };
}

interface RouteLeg {
    distance: {
        text: string;
        value: number;
    };
    duration: {
        text: string;
        value: number;
    };
    startAddress: string;
    endAddress: string;
    steps: RouteStep[];
}

interface RouteResult {
    distance: number;
    duration: number;
    waypointOrder: number[];
    steps: RouteLeg[];
}

// Routes
app.get('/api/v1', async (_req: Request, res: Response) => {
    res.status(200).json({
        message: 'Hello World'
    });
});

app.post('/api/v1', async (req: Request, res: Response) => {
    const { addresses } = req.body as { addresses: Address[] };

    // Validate input
    if (!Array.isArray(addresses) || addresses.length < 2) {
        return res.status(400).json({
            error: 'At least two addresses are required'
        });
    }

    // Find start and destination addresses
    const startAddress = addresses.find(addr => addr.isStart);
    const destinationAddress = addresses.find(addr => addr.isDestination);

    if (!startAddress || !destinationAddress) {
        return res.status(400).json({
            error: 'One address must be marked as start and one as destination'
        });
    }

    // Get waypoints (addresses that are neither start nor destination)
    const waypoints = addresses
        .filter(addr => !addr.isStart && !addr.isDestination)
        .map(addr => addr.text);

        console.log("###################")
        console.log(waypoints)

    // Calculate route using Google Maps Directions API
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        return res.status(500).json({
            error: 'Google Maps API key is not configured'
        });
    }

    try {
        const response = await mapsClient.directions({
            params: {
                key: apiKey,
                origin: startAddress.text,
                destination: destinationAddress.text,
                mode: TravelMode.driving,
                waypoints: waypoints,
                optimize: waypoints.length > 0 ? true : false
            }
        });

        const data = response.data;
        const route = data.routes[0];

        // Format response
        const result: RouteResult = {
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
    } catch (error: any) {
        console.error(error);

        if (error.response) {
            // the server responded
            res.status(error.response.status).json({
                error: 'Could not calculate route',
                details: error.response.data.error_message
            });
        } else if (error.request) {
            // the server didn't send a response
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
    }
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 

export default app;
