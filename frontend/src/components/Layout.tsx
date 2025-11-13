import { AppBar, Avatar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { MouseEvent, useMemo, useState } from 'react';
import { Link as RouterLink, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { label: 'Dashboard', to: '/' },
  { label: 'Inventario', to: '/inventory' },
  { label: 'Reportes', to: '/reports' }
];

export const Layout = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const initials = useMemo(() => {
    if (!user) return 'U';
    return user.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }, [user]);

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, color: 'inherit' }}>
            Clínica · Inventario
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {navLinks.map((link) => (
              <Button
                key={link.to}
                color="inherit"
                component={NavLink}
                to={link.to}
                sx={({ isActive }) => ({
                  opacity: isActive ? 1 : 0.7
                })}
              >
                {link.label}
              </Button>
            ))}
            <IconButton color="inherit" onClick={handleMenu} size="large">
              <Avatar>{initials}</Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem disabled>{user?.email}</MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  logout();
                }}
              >
                Cerrar sesión
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ py: 4, flex: 1 }}>
        <Outlet />
      </Container>
    </Box>
  );
};
