import { useState } from 'react';
import { Sidebar as ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, IconButton, Typography } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import Person2Outlined from '@mui/icons-material/Person2Outlined';
import MessageOutlined from '@mui/icons-material/MessageOutlined';
import { useAuthHook } from '@/hooks/useAuthHook';
import Item from '@/components/layout/SideBar/item';
import { useLocation } from 'react-router-dom';

const SideBarItemTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/documents': 'Documents',
  '/profile': 'Profile',
  '/chats': 'Chats',
};

const Sidebar = () => {
  const { user } = useAuthHook();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Box
      // sx={{
      //   '& .pro-sidebar-inner': {},
      //   '& .pro-icon-wrapper': {
      //     backgroundColor: 'transparent !important',
      //   },
      //   '& .pro-inner-item': {
      //     padding: '5px 35px 5px 20px !important',
      //   },
      //   '& .pro-inner-item:hover': {
      //     color: '#868dfb !important',
      //   },
      //   '& .pro-menu-item.active .pro-inner-item': {
      //     color: '#6870fa !important',
      //     fontWeight: 'bold !important',
      //   },
      // }}
      sx={{
        '& .ps-menu-button': {
          padding: '5px 35px 5px 20px',
        },
        '& .ps-menu-button:hover': {
          color: '#868dfb',
        },
        '& .ps-menuitem-root.ps-active > .ps-menu-button': {
          color: '#6870fa',
          fontWeight: 'bold',
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu>
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: '10px 0 20px 0',
            }}
          >
            {!isCollapsed && (
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                ml='15px'
              >
                <Typography variant='h3'></Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box
              display='flex'
              justifyContent='center'
              alignItems='center'
              mb='25px'
            >
              <img
                alt='profile-user'
                width='100px'
                height='100px'
                style={{ cursor: 'pointer', borderRadius: '50%' }}
                src={user?.photoURL}
              />
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : '10%'}>
            <Item
              title={SideBarItemTitles['/']}
              to='/'
              icon={<HomeOutlinedIcon />}
              active={currentPath === '/'}
            />
            <Item
              title={SideBarItemTitles['/documents']}
              to='/documents'
              icon={<BookOutlinedIcon />}
              active={currentPath === '/documents'}
            />
            <Item
              title={SideBarItemTitles['/profile']}
              to='/profile'
              icon={<Person2Outlined />}
              active={currentPath === '/profile'}
            />
            <Item
              title={SideBarItemTitles['/chats']}
              to='/chats'
              icon={<MessageOutlined />}
              active={currentPath === '/chats'}
            />

            <Typography variant='h6' sx={{ m: '15px 0 5px 20px' }}>
              Data
            </Typography>

            <Typography variant='h6' sx={{ m: '15px 0 5px 20px' }}>
              Pages
            </Typography>

            <Typography variant='h6' sx={{ m: '15px 0 5px 20px' }}>
              Educational
            </Typography>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
