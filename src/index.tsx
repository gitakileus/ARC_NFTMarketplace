import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import App from 'App';
import theme from 'config/theme';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ApplicationUpdater from 'state/application/updater';
import MulticallUpdater from 'state/multicall/updater';
import { store } from 'store';
import { Web3Provider } from 'web3';

function Updaters() {
  return (
    <>
      <ApplicationUpdater />
      <MulticallUpdater />
    </>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <Web3Provider>
      <Updaters />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Web3Provider>
  </Provider>,
  document.querySelector('#root')
);
