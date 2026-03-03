import React from 'react';
import { 
  Drawer, List, Typography, Divider, 
  ListItem, ListItemButton, ListItemIcon, 
  ListItemText, Box, useTheme 
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Folder as ProjectsIcon,
  AccountCircle as ProfileIcon,
  Settings as SettingsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Projects', icon: <ProjectsIcon />, path: '/projects' },
  { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

export function Sidebar({ drawerWidth, mobileOpen, handleDrawerToggle, darkMode, toggleDarkMode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
  navigate('/');
};


  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #7b1fa2, #4a148c)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          MyWorkTrace
        </Typography>
      </Box>

      <Divider />

      <List sx={{ flexGrow: 1, pt: 2}}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding component={Link} to={item.path}>
            <ListItemButton
              selected={location.pathname === item.path}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 1,
                color: theme.palette.text.primary,
                '&.Mui-selected': {
                  color: darkMode ? '#ffffff' : '#4a148c',
                  '& .MuiListItemIcon-root': {
                    color: darkMode ? '#ffffff' : '#4a148c',
                  },
                },
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(98, 0, 238, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {React.cloneElement(item.icon, {
                  color: location.pathname === item.path 
                    ? darkMode ? '#ffffff' : '#4a148c'
                    : 'inherit',
                })}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: location.pathname === item.path ? 600 : 400 
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={toggleDarkMode}
          sx={{
            borderRadius: 1,
            color: theme.palette.text.primary,
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(98, 0, 238, 0.08)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            {darkMode ? (
              <LightModeIcon color="inherit" />
            ) : (
              <DarkModeIcon color="inherit" />
            )}
          </ListItemIcon>
          <ListItemText primary={darkMode ? 'Light Mode' : 'Dark Mode'} />
        </ListItemButton>

        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            color: theme.palette.error.main,
            '&:hover': {
              backgroundColor: 'rgba(244, 67, 54, 0.08)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <LogoutIcon color="inherit" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}