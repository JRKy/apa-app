import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Paper, Dialog, Divider, Link } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface HelpProps {
  open: boolean;
  onClose: () => void;
}

const Help = ({ open, onClose }: HelpProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Help & Documentation
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Getting Started
          </Typography>
          <Typography paragraph>
            Welcome to the Antenna Pointing Angle (APA) Application! This tool helps you calculate 
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
                You can select a location in two ways:
              </Typography>
              <ul>
                <li>Click directly on the map</li>
                <li>Use the search box to find a specific location</li>
              </ul>
              <Typography>
                Once selected, the application will calculate pointing angles to all satellites from that location.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>What do the satellite colors and lines mean?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                The satellite information and connection lines are color-coded based on elevation angle:
              </Typography>
              <ul>
                <li>Green (solid line): Good visibility (elevation ≥ 10°)</li>
                <li>Blue (dashed line): Poor visibility (elevation between 0° and 10°)</li>
                <li>Red (dashed line): Not visible/below horizon (elevation ≤ 0°)</li>
              </ul>
              <Typography>
                The lines on the map show the direct path between your selected location and each satellite,
                with the line style indicating the satellite's visibility from that location.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>What information is shown for each satellite?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                For each satellite, you can see:
              </Typography>
              <ul>
                <li>Elevation angle (Elev)</li>
                <li>Azimuth angle (Az)</li>
                <li>Longitude (Lon)</li>
                <li>Altitude (Alt) - toggleable between km and mi</li>
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