import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Header from 'components/Header';
import { SnackbarProvider } from 'notistack';
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from 'routes';

const useStyles = makeStyles({
  root: {
    backgroundColor: 'red',
  },
});

export default function App() {
  const classes = useStyles();

  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      hideIconVariant
      classes={{
        variantInfo: classes.root,
      }}
    >
      <BrowserRouter>
        <Header />
        <Box sx={{ pt: { xs: 12, md: 15 } }}>
          <Routes />
        </Box>
      </BrowserRouter>
    </SnackbarProvider>
  );
}
