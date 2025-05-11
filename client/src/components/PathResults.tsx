import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
  Paper,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

interface PathData {
  distance: number;
  duration: number;
  waypointOrder: number[];
  steps: {
    distance: { text: string; value: number };
    duration: { text: string; value: number };
    startAddress: string;
    endAddress: string;
    steps: {
      instruction: string;
      distance: { text: string; value: number };
      duration: { text: string; value: number };
    }[];
  }[];
}

const PathResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathData = location.state?.pathData as PathData;

  if (!pathData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          No path data available
        </Typography>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Addresses
        </Button>
      </Box>
    );
  }

  const formatDistance = (meters: number) => {
    const km = meters / 1000;
    return `${km.toFixed(1)} km`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        Back to Addresses
      </Button>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Route Summary
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
            <Paper sx={{ p: 2, flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Distance
              </Typography>
              <Typography variant="h6">
                {formatDistance(pathData.distance)}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Duration
              </Typography>
              <Typography variant="h6">
                {formatDuration(pathData.duration)}
              </Typography>
            </Paper>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Turn-by-Turn Directions
          </Typography>
          <List>
            {pathData.steps.map((leg, legIndex) => (
              <React.Fragment key={legIndex}>
                <ListItem>
                  <ListItemText
                    primary={`Leg ${legIndex + 1}`}
                    secondary={`${leg.distance.text} • ${leg.duration.text}`}
                  />
                </ListItem>
                <Divider />
                {leg.steps.map((step, stepIndex) => (
                  <ListItem key={stepIndex} sx={{ pl: 4 }}>
                    <ListItemText
                      primary={
                        <div
                          dangerouslySetInnerHTML={{ __html: step.instruction }}
                        />
                      }
                      secondary={`${step.distance.text} • ${step.duration.text}`}
                    />
                  </ListItem>
                ))}
                {legIndex < pathData.steps.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PathResults; 