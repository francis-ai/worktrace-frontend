import { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';

const drawerWidth = 240;

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#9c27b0' : '#7b1fa2',
        light: darkMode ? '#ce93d8' : '#e1bee7',
        dark: darkMode ? '#6a1b9a' : '#4a148c',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    components: {
      MuiListItemButton: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              backgroundColor: darkMode ? '#4a148c' : '#e1bee7',
              '&:hover': {
                backgroundColor: darkMode ? '#6a1b9a' : '#ce93d8',
              },
            },
          },
        },
      },
    },
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Topbar 
          drawerWidth={drawerWidth}
          handleDrawerToggle={handleDrawerToggle}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <Sidebar
          drawerWidth={drawerWidth}
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <Box
          component="main"
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            pt: { xs: 8, sm: 8 } 
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}