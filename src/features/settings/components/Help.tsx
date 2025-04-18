import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Help = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Help & Documentation
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Getting Started
        </Typography>
        <Typography paragraph>
          Welcome to the APA App! This application helps you calculate antenna pointing angles
          and track satellite positions. Here's how to get started:
        </Typography>
        
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Frequently Asked Questions
        </Typography>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>How do I set my location?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              The app will automatically detect your location. You can also manually set your location
              by clicking on the map or using the location search feature.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>How do I track a satellite?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Select a satellite from the list in the sidebar. The app will show its current position
              and calculate the optimal antenna pointing angles for your location.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>What do the different colors on the map mean?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              The colors represent different signal strengths and coverage areas. Green indicates
              strong signal, yellow is moderate, and red is weak or no signal.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Contact Support
        </Typography>
        <Typography paragraph>
          If you need additional help, please contact our support team at:
          support@apa-app.com
        </Typography>
      </Paper>
    </Box>
  );
};

export default Help; 