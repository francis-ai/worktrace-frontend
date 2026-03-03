import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Badge, useTheme } from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

const menuItems = [
  { text: 'Dashboard', path: '/dashboard' },
  { text: 'Projects', path: '/projects' },
  { text: 'Profile', path: '/profile' },
  { text: 'Settings', path: '/settings' },
];

export function Topbar({ drawerWidth, handleDrawerToggle, darkMode, toggleDarkMode }) {
  const location = useLocation();
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        backdropFilter: 'blur(8px)',
        backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ 
            mr: 2, 
            display: { sm: 'none' },
            color: theme.palette.text.primary 
          }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ 
            flexGrow: 1,
            color: theme.palette.text.primary
          }}
        >
          {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" sx={{ color: theme.palette.text.primary }}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: darkMode ? '#9c27b0' : '#7b1fa2',
              color: '#ffffff'
            }}
          >
            U
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}