import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Paper,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    Clear as ClearIcon,
    Delete as DeleteIcon,
    Flag as FlagIcon,
    SportsScore as SportsScoreIcon,
    Edit as EditIcon,
    Map as MapIcon,
    Send as SendIcon,
    DirectionsCar as DirectionsCarIcon
} from '@mui/icons-material';

interface Address {
    id: string;
    text: string;
    isSelected: boolean;
    isStart: boolean;
    isDestination: boolean;
}

const STORAGE_KEY = 'travel-addresses';

const INITIAL_ADDRESSES: Address[] = [
    { id: '1', text: '1234 Legacy Drive, Plano, TX 75024', isSelected: true, isStart: false, isDestination: false },
    { id: '2', text: '5678 Preston Road, Plano, TX 75093', isSelected: true, isStart: false, isDestination: false },
    { id: '3', text: '9012 Coit Road, Plano, TX 75075', isSelected: true, isStart: false, isDestination: false },
    { id: '4', text: '3456 Spring Creek Parkway, Plano, TX 75023', isSelected: true, isStart: false, isDestination: false },
    { id: '5', text: '7890 Park Boulevard, Plano, TX 75074', isSelected: true, isStart: false, isDestination: false },
    { id: '6', text: '2345 Alma Drive, Plano, TX 75023', isSelected: true, isStart: false, isDestination: false },
    { id: '7', text: '6789 Independence Parkway, Plano, TX 75075', isSelected: true, isStart: false, isDestination: false },
    { id: '8', text: '0123 Custer Road, Plano, TX 75075', isSelected: true, isStart: false, isDestination: false },
    { id: '9', text: '4567 Hedgcoxe Road, Plano, TX 75093', isSelected: true, isStart: false, isDestination: false },
    { id: '10', text: '8901 Ohio Drive, Plano, TX 75024', isSelected: true, isStart: false, isDestination: false },
];

export const AddressManager = () => {

    const [addresses, setAddresses] = useState<Address[]>(() => {
        const savedAddresses = localStorage.getItem(STORAGE_KEY);
        if (savedAddresses) {
            return JSON.parse(savedAddresses);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ADDRESSES));
        return INITIAL_ADDRESSES;
    });
    const [newAddress, setNewAddress] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    }, [addresses]);

    const handleAddAddress = () => {
        if (newAddress.trim() && newAddress.length <= 200) {
            setAddresses([
                ...addresses,
                {
                    id: Date.now().toString(),
                    text: newAddress.trim(),
                    isSelected: true,
                    isStart: false,
                    isDestination: false
                }
            ]);
            setNewAddress('');
        }
    };

    const handleEditStart = (address: Address) => {
        setEditingId(address.id);
        setEditText(address.text);
    };

    const handleEditSave = () => {
        if (editingId && editText.trim() && editText.length <= 200) {
            setAddresses(addresses.map(addr =>
                addr.id === editingId ? { ...addr, text: editText.trim() } : addr
            ));
            setEditingId(null);
            setEditText('');
        }
    };

    const handleDelete = (id: string) => {
        setAddresses(addresses.filter(addr => addr.id !== id));
    };

    const handleOpenInMaps = (address: string) => {
        const encodedAddress = encodeURIComponent(address);
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    };

    const handleNavigate = (startAddress: string, endAddress: string) => {
        const encodedStart = encodeURIComponent(startAddress);
        const encodedEnd = encodeURIComponent(endAddress);
        window.open(`https://www.google.com/maps/dir/?api=1&origin=${encodedStart}&destination=${encodedEnd}`, '_blank');
    };

    const handleToggleSelect = (id: string) => {
        setAddresses(addresses.map(addr =>
            addr.id === id ? { ...addr, isSelected: !addr.isSelected } : addr
        ));
    };

    const handleToggleStart = (id: string) => {
        setAddresses(addresses.map(addr => ({
            ...addr,
            isSelected: addr.id === id ? true : addr.isSelected,
            isStart: addr.id === id ? !addr.isStart : false
        })));
    };

    const handleToggleDestination = (id: string) => {
        setAddresses(addresses.map(addr => ({
            ...addr,
            isSelected: addr.id === id ? true : addr.isSelected,
            isDestination: addr.id === id ? !addr.isDestination : false
        })));
    };

    const handleSubmit = async () => {
        try {
            setError(null);
            setIsLoading(true);
            const selectedAddresses = addresses.filter(addr => addr.isSelected);

            if (selectedAddresses.length < 2) {
                throw new Error('Please select at least two addresses to calculate a route');
            }

            // todo: use env variables for the url base
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ addresses: selectedAddresses }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit addresses');
            }

            const result = await response.json();
            setResults(result);
        } catch (error) {
            console.error('Error submitting addresses:', error);
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearResults = () => {
        setResults(null);
        setError(null);
    };

    return (
        <Box sx={{
            maxWidth: { xs: '100%', sm: '600px', md: '800px' },
            mx: 'auto',
            mt: { xs: 2, sm: 4 },
            p: { xs: 1, sm: 2 }
        }}>
            <Typography
                variant="h5"
                gutterBottom
                sx={{
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    textAlign: { xs: 'center', sm: 'left' }
                }}
            >
                Address Manager
            </Typography>

            <Paper
                sx={{
                    p: { xs: 1.5, sm: 2, md: 3 },
                    mb: 2,
                    borderRadius: 2
                }}
            >
                <Box sx={{
                    display: 'flex',
                    gap: 1,
                    mb: 2,
                    flexDirection: { xs: 'column', sm: 'row' }
                }}>
                    <TextField
                        fullWidth
                        label="New Address"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        error={newAddress.length > 200}
                        helperText={`${newAddress.length}/200 characters`}
                        size="small"
                    />
                    <Button
                        variant="contained"
                        onClick={handleAddAddress}
                        disabled={!newAddress.trim() || newAddress.length > 200}
                        sx={{
                            minWidth: { xs: '100%', sm: 'auto' },
                            height: { xs: '40px', sm: 'auto' }
                        }}
                    >
                        Add
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                        onClick={handleSubmit}
                        disabled={addresses.filter(addr => addr.isSelected).length < 2 || isLoading}
                        sx={{
                            minWidth: { xs: '100%', sm: 'auto' },
                            height: { xs: '40px', sm: 'auto' }
                        }}
                    >
                        {isLoading ? 'Calculating...' : 'Calculate Route'}
                    </Button>
                </Box>

                <List>
                    {addresses.map((address) => (
                        <ListItem
                            key={address.id}
                            sx={{
                                bgcolor: 'background.paper',
                                mb: 1,
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'stretch', sm: 'center' },
                                gap: { xs: 1, sm: 0 },
                                position: 'relative'
                            }}
                        >
                            {editingId === address.id ? (
                                <Box sx={{
                                    display: 'flex',
                                    gap: 1,
                                    width: '100%',
                                    flexDirection: { xs: 'column', sm: 'row' }
                                }}>
                                    <TextField
                                        fullWidth
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        error={editText.length > 200}
                                        helperText={`${editText.length}/200 characters`}
                                        size="small"
                                    />
                                    <Box sx={{
                                        display: 'flex',
                                        gap: 1,
                                        flexDirection: { xs: 'row', sm: 'column' }
                                    }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleEditSave}
                                            disabled={!editText.trim() || editText.length > 200}
                                            fullWidth
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={() => {
                                                setEditingId(null);
                                                setEditText('');
                                            }}
                                            fullWidth
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                </Box>
                            ) : (
                                <>
                                    <Checkbox
                                        checked={address.isSelected ? true : false}
                                        onChange={() => handleToggleSelect(address.id)}
                                        disabled={address.isStart || address.isDestination}
                                        sx={{
                                            mr: 1,
                                            '&.Mui-disabled': {
                                                color: 'primary.main',
                                                opacity: 0.8
                                            }
                                        }}
                                    />
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {address.text}
                                                {address.isStart && (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: 'success.main',
                                                            fontWeight: 'bold',
                                                            ml: 1
                                                        }}
                                                    >
                                                        (Start)
                                                    </Typography>
                                                )}
                                                {address.isDestination && (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: 'secondary.main',
                                                            fontWeight: 'bold',
                                                            ml: 1
                                                        }}
                                                    >
                                                        (Destination)
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                        sx={{
                                            wordBreak: 'break-word',
                                            pr: { xs: 0, sm: 2 }
                                        }}
                                    />
                                    <ListItemSecondaryAction
                                        sx={{
                                            position: { xs: 'static', sm: 'absolute' },
                                            display: 'flex',
                                            gap: 1,
                                            justifyContent: { xs: 'flex-end', sm: 'flex-start' },
                                            mt: { xs: 1, sm: 0 }
                                        }}
                                    >
                                        <Tooltip title={address.isStart ? "Remove as start address" : "Set as start address"}>
                                            <IconButton
                                                edge="end"
                                                aria-label="toggle start"
                                                onClick={() => handleToggleStart(address.id)}
                                                color={address.isStart ? "success" : "default"}
                                            >
                                                <FlagIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={address.isDestination ? "Remove as destination" : "Set as destination"}>
                                            <IconButton
                                                edge="end"
                                                aria-label="toggle destination"
                                                onClick={() => handleToggleDestination(address.id)}
                                                color={address.isDestination ? "secondary" : "default"}
                                            >
                                                <SportsScoreIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Open in Google Maps">
                                            <IconButton
                                                edge="end"
                                                aria-label="open in maps"
                                                onClick={() => handleOpenInMaps(address.text)}
                                            >
                                                <MapIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit address">
                                            <IconButton
                                                edge="end"
                                                aria-label="edit"
                                                onClick={() => handleEditStart(address)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete address">
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => handleDelete(address.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </ListItemSecondaryAction>
                                </>
                            )}
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {isLoading && (
                <Paper
                    elevation={2}
                    sx={{
                        mt: 3,
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <CircularProgress />
                    <Typography variant="body1">
                        Calculating optimal route...
                    </Typography>
                </Paper>
            )}

            {error && (
                <Paper
                    elevation={2}
                    sx={{
                        mt: 3,
                        p: 2,
                        bgcolor: 'error.light',
                        color: 'error.contrastText'
                    }}
                >
                    <Typography variant="body1">{error}</Typography>
                </Paper>
            )}

            {results && !isLoading && (
                <Paper
                    elevation={2}
                    sx={{
                        mt: 3,
                        p: 2,
                        bgcolor: 'background.paper'
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2
                    }}>
                        <Typography variant="h6">
                            Route Results
                        </Typography>
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<ClearIcon />}
                            onClick={handleClearResults}
                            size="small"
                        >
                            Clear Results
                        </Button>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">
                            Total Distance: {(results.distance / 1000).toFixed(2)} km
                        </Typography>
                        <Typography variant="subtitle1">
                            Total Duration: {Math.round(results.duration / 60)} minutes
                        </Typography>
                    </Box>

                    <Typography variant="subtitle1" gutterBottom>
                        Optimized Route:
                    </Typography>

                    <List>
                        {results.steps.map((step: any, index: number) => (
                            <ListItem key={index} divider>
                                <ListItemText
                                    primary={`Step ${index + 1}`}
                                    secondary={
                                        <>
                                            <Typography component="span" variant="body2">
                                                From: {step.startAddress}
                                            </Typography>
                                            <br />
                                            <Typography component="span" variant="body2">
                                                To: {step.endAddress}
                                            </Typography>
                                            <br />
                                            <Typography component="span" variant="body2">
                                                Distance: {(step.distance.value / 1000).toFixed(2)} km
                                            </Typography>
                                            <br />
                                            <Typography component="span" variant="body2">
                                                Duration: {Math.round(step.duration.value / 60)} minutes
                                            </Typography>
                                        </>
                                    }
                                />
                                <ListItemSecondaryAction>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<DirectionsCarIcon />}
                                        onClick={() => handleNavigate(step.startAddress, step.endAddress)}
                                    >
                                        Navigate
                                    </Button>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </Box>
    );
}; 