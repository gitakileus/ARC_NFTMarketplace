import './index.css';
import { AccountBalanceWalletOutlined } from '@mui/icons-material';
import { IconButton, Button, Typography } from '@mui/material';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { SupportedChainId } from 'constants/addresses';
import { ethers } from 'ethers';
import ProfileModal from 'pages/Profile/ProfileModal';
import React, { useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AuthService from 'services/auth';
import { useModalOpen, useWalletModalToggle } from 'state/application/hooks';
import { ApplicationModal } from 'state/application/reducer';
import { useAppDispatch, useAppSelector } from 'state/hooks';
import { loginUser, setUser } from 'state/user/actions';
import { logoutUser } from 'state/user/actions';
import WalletLink from 'walletlink';
import { useWeb3 } from 'web3';
import Web3Modal from 'web3modal';

const INFURA_ID = 'e67a2556dede4ff2b521a375a1905f8b';

const web3Modal = new Web3Modal({
  disableInjectedProvider: true,
  network: 'mainnet',
  cacheProvider: true,
  providerOptions: {
    'custom-metamask': {
      display: {
        name: 'MetaMask',
        description: 'Connect to your MetaMask Wallet',
        logo: 'https://duckduckgo.com/i/b08b6e4c.png',
      },
      package: true,
      connector: async () => {
        if ((window as any).ethereum === undefined) {
          (window as any).open('https://metamask.app.link/dapp/www.ethbox.org/app/', '_blank');
          return;
        } else if ((window as any).ethereum.providers !== undefined) {
          const providers = (window as any).ethereum.providers;
          const provider = providers.find((p: any) => p.isMetaMask); // <-- LOOK HERE
          if (provider) {
            try {
              await provider.request({ method: 'eth_requestAccounts' });
              return provider;
            } catch (error) {
              throw new Error('User Rejected');
            }
          } else {
            (window as any).open('https://metamask.app.link/dapp/www.ethbox.org/app/', '_blank');
            return;
          }
        } else if ((window as any).ethereum.providers === undefined && (window as any).ethereum.isMetaMask === true) {
          const provider = (window as any).ethereum;
          try {
            await provider.request({ method: 'eth_requestAccounts' });
            return provider;
          } catch (error) {
            throw new Error('User Rejected');
          }
        } else {
          window.open('https://metamask.app.link/dapp/www.ethbox.org/app/', '_blank');
          return;
        }
      },
    },
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: INFURA_ID,
      },
    },
    'custom-walletlink': {
      display: {
        logo: 'https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0',
        name: 'Coinbase',
        description: 'Connect to Coinbase Wallet (not Coinbase App)',
      },
      options: {
        appName: 'Coinbase', // Your app name
        networkUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
        chainId: 1,
      },
      package: WalletLink,
      connector: async (_: any, options: any) => {
        const { appName, networkUrl, chainId } = options;
        const walletLink = new WalletLink({ appName });
        const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
        await provider.enable();
        return provider;
      },
    },
  },
  theme: {
    background: '#1E1E1E',
    main: 'rgb(199, 199, 199)',
    secondary: 'rgb(136, 136, 136)',
    border: 'rgba(195, 195, 195, 0.14)',
    hover: 'rgb(16, 26, 32)',
  },
});

export default function ConnectWalletButton() {
  const navigate = useNavigate();
  const { chainId, instance, dispatch: web3Dispatch } = useWeb3();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.user);
  const toggleWalletModal = useWalletModalToggle();
  const isWalletModalOpen = useModalOpen(ApplicationModal.WALLET);
  const [windowSize, setWindowSize] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    setWindowSize(window.innerWidth);
  }, []);

  useEffect(() => {
    setIsMobile(windowSize < 768);
  }, [windowSize]);

  const login = useCallback(
    async (account: string) => {
      const user = await AuthService.getUser(account);
      dispatch(loginUser());
      dispatch(setUser(user));
    },
    [dispatch]
  );

  const connect = useCallback(async () => {
    try {
      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      const chainId = await signer.getChainId();
      if (web3Dispatch) {
        const verifyAuth = await AuthService.verifyAuth();
        if (!verifyAuth) {
          const result = await AuthService.authorize(provider, account);
          if (result) {
            web3Dispatch({ type: 'SET_WEB3', instance, provider, account, chainId });
            login(account);
          }
        } else {
          web3Dispatch({ type: 'SET_WEB3', instance, provider, account, chainId });
          login(account);
        }
      }
    } catch (err) {
      console.log(err);
    }
    if (isWalletModalOpen) {
      toggleWalletModal();
    }
  }, [web3Dispatch, login, toggleWalletModal, isWalletModalOpen]);

  const switchNetwork = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SupportedChainId.HEX_RINKEBY }],
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: SupportedChainId.HEX_RINKEBY,
                  chainName: 'Rinkeby Network',
                  rpcUrls: ['https://rinkeby.infura.io/v3/'],
                  blockExplorerUrls: ['https://rinkeby.etherscan.io'],
                },
              ],
            });
          } catch (addError) {
            throw addError;
          }
        }
      }
    }
  };

  useEffect(() => {
    if (chainId !== SupportedChainId.MAINNET && chainId !== SupportedChainId.RINKEBY) {
      switchNetwork();
    }
    if (web3Modal.cachedProvider) {
      toggleWalletModal();
    }
  }, []);

  useEffect(() => {
    if (isWalletModalOpen) {
      connect();
    }
  }, [connect, isWalletModalOpen]);

  useEffect(() => {
    if (instance?.on && web3Dispatch) {
      instance.on('chainChanged', (_hexChainId: string) => {
        const newChainId = parseInt(_hexChainId, 16);
        if (newChainId !== SupportedChainId.MAINNET && newChainId !== SupportedChainId.RINKEBY) {
          switchNetwork();
        }
        web3Dispatch({ type: 'SET_CHAINID', chainId: newChainId });
      });
      instance.on('disconnect', async (error: { code: number; message: string }) => {
        await web3Modal.clearCachedProvider();
        if (instance?.disconnect && typeof instance.disconnect === 'function') {
          await instance.disconnect();
        }
        if (web3Dispatch) {
          AuthService.logout();
          web3Dispatch({ type: 'RESET_WEB3' });
          dispatch(logoutUser());
        }
      });
      instance.on('accountsChanged', async (accounts: string[]) => {
        if (accounts.length > 0) {
          web3Dispatch({ type: 'SET_ACCOUNT', account: accounts[0] });
          login(accounts[0]);
        } else {
          await web3Modal.clearCachedProvider();
          if (instance?.disconnect && typeof instance.disconnect === 'function') {
            await instance.disconnect();
          }
          if (web3Dispatch) {
            AuthService.logout();
            web3Dispatch({ type: 'RESET_WEB3' });
            dispatch(logoutUser());
          }
        }
      });
    }
  }, [instance, web3Dispatch]);

  return isAuthenticated ? (
    <ProfileModal web3Modal={web3Modal} username={user.username} wallet={user.wallet} photoUrl={user.photoUrl} />
  ) : (
    <>
      <Button
        sx={{
          minWidth: 60,
          textTransform: 'none',
          backgroundColor: 'rgba(0, 122, 255, 0.08)',
          px: 2,
          py: { lg: 2, md: 1 },
          border: 'none',
        }}
        onClick={toggleWalletModal}
      >
        <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
          Connect wallet
        </Typography>
      </Button>
    </>
  );
}
