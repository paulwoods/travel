import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Map as MapIcon } from '@mui/icons-material';

interface Address {
  id: string;
  text: string;
}

const STORAGE_KEY = 'travel-addresses';

const INITIAL_ADDRESSES: Address[] = [
  { id: '1', text: '1234 Legacy Drive, Plano, TX 75024' },
  { id: '2', text: '5678 Preston Road, Plano, TX 75093' },
  { id: '3', text: '9012 Coit Road, Plano, TX 75075' },
  { id: '4', text: '3456 Spring Creek Parkway, Plano, TX 75023' },
  { id: '5', text: '7890 Park Boulevard, Plano, TX 75074' },
  { id: '6', text: '2345 Alma Drive, Plano, TX 75023' },
  { id: '7', text: '6789 Independence Parkway, Plano, TX 75075' },
  { id: '8', text: '0123 Custer Road, Plano, TX 75075' },
  { id: '9', text: '4567 Hedgcoxe Road, Plano, TX 75093' },
  { id: '10', text: '8901 Ohio Drive, Plano, TX 75024' },
];

export const AddressManager = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses]);

  const handleAddAddress = () => {
    if (newAddress.trim() && newAddress.length <= 200) {
      setAddresses([
        ...addresses,
        { id: Date.now().toString(), text: newAddress.trim() }
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
                gap: { xs: 1, sm: 0 }
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
                  <ListItemText 
                    primary={address.text} 
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
    </Box>
  );
}; 