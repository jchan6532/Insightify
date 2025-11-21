import { Box, IconButton } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { useContext } from 'react';

import { ColorModeContext } from '@/contexts';
import { useAuth } from '@/hooks/useAuth';

const ICON_SIZE = 25;

const Topbar = () => {
  const { toggleColorMode } = useContext(ColorModeContext);
  const { logout } = useAuth();
  const handleLogout = async () => {
    await logout();
  };

  const handleToggleColorMode = () => {
    toggleColorMode();
  };

  return (
    <Box display='flex' justifyContent='space-between' p={2}>
      <Box display='flex' borderRadius='3px'>
        <InputBase
          sx={{
            ml: 2,
            mr: 2,
            flex: 1,
            fontSize: 22,
            width: 300,
            backgroundColor: 'rgba(255,255,255,0.85)',
            borderRadius: 5,
            pl: 2,
          }}
          placeholder='Search'
        />
        <IconButton type='button' sx={{ p: 1, ml: 2, mr: 2 }}>
          <SearchIcon sx={{ fontSize: ICON_SIZE }} />
        </IconButton>
      </Box>

      <Box display='flex'>
        <IconButton onClick={handleToggleColorMode}>
          <DarkModeOutlinedIcon sx={{ fontSize: ICON_SIZE }} />
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon sx={{ fontSize: ICON_SIZE }} />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon sx={{ fontSize: ICON_SIZE }} />
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon sx={{ fontSize: ICON_SIZE }} />
        </IconButton>
        <IconButton onClick={handleLogout}>
          <LogoutIcon sx={{ fontSize: ICON_SIZE }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
