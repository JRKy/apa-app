import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Paper, Dialog, Divider, Link } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface HelpProps {
  open: boolean;
  onClose: () => void;
}

const Help = ({ open, onClose }: HelpProps) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      disableEnforceFocus
      disableAutoFocus
      aria-labelledby="help-dialog-title"
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom id="help-dialog-title">
          Help & Documentation
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Getting Started
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to the Antenna Pointing Angles (APAA) Application! This tool helps you calculate 
            antenna pointing angles for MUOS and ALT satellites based on your selected location.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Features
          </Typography>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>How do I select a location?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                You can select a location in three ways:
              </Typography>
              <ul>
                <li>Click directly on the map</li>
                <li>Use the search box with autocomplete to find a specific location</li>
                <li>Use the location button to get your current position</li>
              </ul>
              <Typography>
                The search box supports:
              </Typography>
              <ul>
                <li>City names</li>
                <li>Addresses</li>
                <li>Landmarks</li>
                <li>Coordinates (latitude, longitude)</li>
              </ul>
              <Typography>
                Once selected, the application will calculate pointing angles to all satellites from that location.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>What do the different map layers show?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                The application offers four different map layers:
              </Typography>
              <ul>
                <li><strong>Light Mode:</strong> Standard map view with good visibility in daylight</li>
                <li><strong>Dark Mode:</strong> High-contrast theme for better visibility in low-light conditions</li>
                <li><strong>Satellite:</strong> Satellite imagery for detailed terrain visualization</li>
                <li><strong>Terrain:</strong> Topographic view showing elevation contours</li>
              </ul>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>How do I interpret the satellite information?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                For each satellite, the application shows:
              </Typography>
              <ul>
                <li><strong>Elevation Angle:</strong> The angle above the horizon (higher is better)</li>
                <li><strong>Azimuth:</strong> The horizontal direction to point your antenna</li>
                <li><strong>Line Quality:</strong> Visual indicator of signal quality based on elevation:
                  <ul>
                    <li>Solid Green: Good visibility (elevation {'>'} 20°)</li>
                    <li>Dashed Blue: Poor visibility (5° - 20°)</li>
                    <li>Dotted Red: Below horizon or blocked ({'<'} 5°)</li>
                  </ul>
                </li>
              </ul>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>How do I change units?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Use the km/mi toggle in the satellite information panel to switch between metric (kilometers) 
                and imperial (miles) units for altitude measurements.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>How do I change the map theme?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Click the theme toggle button in the top-right corner to switch between:
              </Typography>
              <ul>
                <li>Light mode</li>
                <li>Dark mode</li>
                <li>System preference</li>
              </ul>
              <Typography>
                The map tiles will automatically adjust to match your selected theme.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Credits & Information
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Developer:</strong> J. Kennedy
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>GitHub Repository:</strong>{' '}
              <Link 
                href="https://github.com/JRKy/apa-app"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ textDecoration: 'none', color: 'primary.main' }}
              >
                github.com/JRKy/apa-app
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>License:</strong> MIT License
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, opacity: 0.7 }}>
              © {new Date().getFullYear()} J. Kennedy. All rights reserved.
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Contact Support
          </Typography>
          <Typography paragraph>
            For support or inquiries, please visit the GitHub repository.
          </Typography>
        </Paper>
      </Box>
    </Dialog>
  );
};

export default Help; 