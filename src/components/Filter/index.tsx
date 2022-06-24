import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ChevronLeft, FilterList, ExpandLess, ExpandMore, Close } from '@mui/icons-material';
import { Box, Collapse, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import { CSSObject, styled, Theme } from '@mui/material/styles';
import * as React from 'react';
import { useEffect, useState } from 'react';

const drawerWidth = 220;
const windowWidth = window.innerWidth;
const isMobileSize = windowWidth < 768 ? true : false;

const openedMixin = (theme: Theme, isMobile: boolean): CSSObject => ({
  width: isMobileSize ? '100%' : drawerWidth,
  position: 'static',
  borderRadius: 10,
  background: theme.palette.secondary.main,
  marginRight: 24,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme, isMobile: boolean): CSSObject => ({
  position: 'static',
  borderRadius: 10,
  background: theme.palette.secondary.main,
  marginRight: 24,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

interface DrawerProps {
  open: boolean;
  isMobile: boolean;
}

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isMobile',
})<DrawerProps>(({ theme, open, isMobile }) => ({
  width: isMobile ? '100%' : drawerWidth,
  height: isMobile ? '500px' : 'auto',
  position: 'static',
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme, isMobile),
    '& .MuiDrawer-paper': openedMixin(theme, isMobile),
  }),
  ...(!open && {
    ...closedMixin(theme, isMobile),
    '& .MuiDrawer-paper': closedMixin(theme, isMobile),
  }),
}));

export const FilterItem = ({ icon, label, filterOpen, setFilterOpen, children }: any) => {
  const [open, setOpen] = React.useState(false);

  const toggleItem = () => {
    setOpen(!open);
    if (open === false) setFilterOpen(true);
  };

  React.useEffect(() => {
    if (filterOpen === false) setOpen(false);
  }, [filterOpen]);

  return (
    <Box>
      <ListItem button onClick={toggleItem}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} primaryTypographyProps={{ variant: 'body2' }} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </Box>
  );
};

interface IFilters {
  open: boolean;
  setOpen: (arg: boolean) => void;
  children: any;
  isMobile: boolean;
}

export default function Filter(props: IFilters) {
  const { open, setOpen, children, isMobile } = props;
  const isMobileWidth = useMediaQuery('(max-width:768px)');
  const toggleDrawer = () => setOpen(!open);

  return (
    <Drawer
      variant="permanent"
      open={open}
      isMobile={isMobile}
      sx={{ width: isMobileWidth ? '100%' : drawerWidth, maxHeight: '100%', position: 'sticky', top: 0 }}
    >
      <List component="div">
        <ListItem button onClick={toggleDrawer} sx={{ width: isMobileWidth ? '100%' : drawerWidth }}>
          <ListItemIcon sx={{ color: 'primary.main' }}>
            <FilterList />
          </ListItemIcon>
          <ListItemText
            primary="Filters"
            sx={{ color: 'primary.main' }}
            primaryTypographyProps={{ variant: 'body2' }}
          />
          {isMobile ? <Close color="primary" /> : <ChevronLeft color="primary" />}
        </ListItem>
        {children}
      </List>
    </Drawer>
  );
}
