import { Dialog as MuiDialog, DialogContent } from '@mui/material';
import DialogHeader from './DialogHeader';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
}

const Dialog = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'sm',
  fullWidth = true,
}: DialogProps) => {
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      <DialogHeader title={title} onClose={onClose} />
      <DialogContent>
        {children}
      </DialogContent>
    </MuiDialog>
  );
};

export default Dialog; 