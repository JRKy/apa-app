import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setSettingsOpen, setHelpOpen } from '@/store/uiSlice';

export const useDialog = () => {
  const dispatch = useDispatch();
  const { settingsOpen, helpOpen } = useSelector((state: RootState) => state.ui);

  const openSettings = () => dispatch(setSettingsOpen(true));
  const closeSettings = () => dispatch(setSettingsOpen(false));
  const openHelp = () => dispatch(setHelpOpen(true));
  const closeHelp = () => dispatch(setHelpOpen(false));

  return {
    settings: {
      isOpen: settingsOpen,
      open: openSettings,
      close: closeSettings,
    },
    help: {
      isOpen: helpOpen,
      open: openHelp,
      close: closeHelp,
    },
  };
}; 