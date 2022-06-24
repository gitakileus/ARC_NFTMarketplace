import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Menu } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { AppBar, Box, Container, Drawer, IconButton, InputBase, Link, MenuItem, Toolbar } from '@mui/material';
import Select from '@mui/material/Select';
import { alpha, styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import logoImg from 'assets/Arc_logo_large.png';
import searchIcon from 'assets/searchIcon.png';
import ConnectWalletButton from 'components/ConnectWalletButton';
import NavItems from 'components/NavItems';
import SearchModal from 'components/SearchModal';
import theme from 'config/theme';
import json2mq from 'json2mq';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '15px',
  backgroundColor: theme.palette.secondary.main,
  '&:hover': {
    backgroundColor: alpha(theme.palette.secondary.main, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: '100%',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#fff',
  textSizeAdjust: '20px',
  '& .MuiInputBase-input': {
    padding: theme.spacing(2, 2, 2, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

export default function Header() {
  const theme = useTheme();
  const isMobile = !useMediaQuery(
    json2mq({
      minWidth: 900,
    })
  );
  const smallerThanlg = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <>
      <AppBar sx={{ boxShadow: 'none' }}>
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              justifyContent: 'space-between',
            }}
            disableGutters
          >
            <Box display="flex" alignItems="center">
              <Link href="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <img alt="logo" height={80} src={logoImg} />
              </Link>
              {!isMobile && <NavItems header toggleDrawer={toggleDrawer} />}
            </Box>
            {!isMobile ? (
              <>
                <Box px={3} flexGrow={1}>
                  <Search onClick={() => setModalSearch(true)}>
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase placeholder="Search" inputProps={{ 'aria-label': 'search' }} />
                  </Search>
                </Box>
                {!smallerThanlg && (
                  <Select
                    sx={{ marginLeft: 3, marginRight: 3, border: 0, fontWeight: 600 }}
                    inputProps={{ 'aria-label': 'Without label' }}
                    defaultValue={1}
                  >
                    <MenuItem value={1} sx={{ fontWeight: 600 }} autoFocus>
                      <img
                        loading="lazy"
                        width="20"
                        src="https://flagcdn.com/w20/gb.png"
                        srcSet="https://flagcdn.com/w40/gb.png 2x"
                        alt="ENG"
                      />
                      &nbsp; ENG
                    </MenuItem>
                  </Select>
                )}
                <ConnectWalletButton />
              </>
            ) : (
              <Box display="flex" alignItems="center">
                <Box onClick={() => navigate('/search')} sx={{ marginRight: 1.5 }}>
                  <img alt="search" src={searchIcon} width={15} />
                </Box>
                <IconButton
                  onClick={toggleDrawer}
                  sx={{
                    display: { md: 'none', xs: 'flex' },
                  }}
                >
                  <Menu />
                </IconButton>
                <ConnectWalletButton />
              </Box>
            )}
          </Toolbar>
          <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
            <Box p={3} sx={{ backgroundColor: '#1e1e1e', height: '100%' }}>
              <Box mt={3}>
                <NavItems toggleDrawer={toggleDrawer} />
              </Box>
            </Box>
          </Drawer>
        </Container>
      </AppBar>
      {modalSearch && <SearchModal isOpen={modalSearch} onDismiss={() => setModalSearch(false)} />}
    </>
  );
}
