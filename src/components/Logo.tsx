import React from 'react';
import { Box, SvgIcon } from '@mui/material';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';

interface LogoProps {
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ width = 36, height = 36 }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <SvgIcon
        component={SettingsInputAntennaIcon}
        sx={{
          width,
          height,
          color: 'primary.main',
        }}
      />
    </Box>
  );
};

export default Logo; 