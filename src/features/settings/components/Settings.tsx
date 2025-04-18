import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, SelectChangeEvent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setUnits, setLanguage, toggleAutoUpdate, toggleNotifications } from '@/store/settingsSlice';

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);

  const handleUnitsChange = (event: SelectChangeEvent<string>) => {
    dispatch(setUnits(event.target.value as Units));
  };

  const handleLanguageChange = (event: SelectChangeEvent) => {
    dispatch(setLanguage(event.target.value as string));
  };

  const handleAutoUpdateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAutoUpdate());
  };

  const handleNotificationsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleNotifications());
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>
      
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Units</InputLabel>
        <Select
          value={settings.units}
          label="Units"
          onChange={handleUnitsChange}
        >
          <MenuItem value="metric">Metric</MenuItem>
          <MenuItem value="imperial">Imperial</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Language</InputLabel>
        <Select
          value={settings.language}
          label="Language"
          onChange={handleLanguageChange}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="es">Spanish</MenuItem>
          <MenuItem value="fr">French</MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Switch
            checked={settings.autoUpdate}
            onChange={handleAutoUpdateChange}
          />
        }
        label="Auto-update satellite data"
      />

      <FormControlLabel
        control={
          <Switch
            checked={settings.notifications}
            onChange={handleNotificationsChange}
          />
        }
        label="Enable notifications"
      />
    </Box>
  );
};

export default Settings; 