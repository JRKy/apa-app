import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';

interface DialogHeaderProps {
  title: string;
  onClose: () => void;
}

const DialogHeader = ({ title, onClose }: DialogHeaderProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderBottom: `1px solid ${theme.palette.primary.dark}`,
        p: 1.5,
        cursor: 'default',
      }}
    >
      <Typography variant="h6" component="div">
        {title}
      </Typography>
      <IconButton
        onClick={onClose}
        sx={{ color: 'inherit' }}
        aria-label={`Close ${title}`}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
};

export default DialogHeader; 