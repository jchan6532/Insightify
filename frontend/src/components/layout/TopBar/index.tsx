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
import { useAuthHook } from '@/hooks/useAuthHook';

const Topbar = () => {
  const { toggleColorMode } = useContext(ColorModeContext);
  const { logout } = useAuthHook();
  const handleLogout = async () => {
    await logout();
  };

  const handleToggleColorMode = () => {
    toggleColorMode();
  };

  return (
    <Box display='flex' justifyContent='space-between' p={2}>
      <Box display='flex' borderRadius='3px'>
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder='Search' />
        <IconButton type='button' sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      <Box display='flex'>
        <IconButton onClick={handleToggleColorMode}>
          <DarkModeOutlinedIcon />
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon />
        </IconButton>
        <IconButton onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
