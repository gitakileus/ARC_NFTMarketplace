import { Close } from '@mui/icons-material';
import { Box, Button, IconButton, Link, Modal, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Token, CurrencyAmount, Currency } from '@uniswap/sdk-core';
import arcLogo from 'assets/Icon/arc-token.png';
import ethLogo from 'assets/Icon/ether.svg';
import wethLogo from 'assets/Icon/etherRed.svg';
import ProfileLogo from 'components/ProfileLogo';
import { WETH_ADDRESS } from 'constants/addresses';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from 'services/auth';
import { useModalOpen, useProfileModalToggle } from 'state/application/hooks';
import { ApplicationModal } from 'state/application/reducer';
import { useAppDispatch } from 'state/hooks';
import { logoutUser } from 'state/user/actions';
import { useETHBalances, useCurrencyBalances } from 'state/wallet/hooks';
import { shortenAddress } from 'utils';
import { useWeb3 } from 'web3';

const StyledProfileModal = styled('div')(() => ({
  position: 'absolute',
  backgroundColor: '#1E1E1E',
  borderRadius: '10px',
  width: '400px',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '40px',
}));

const StyledProfileCard = styled('div')(() => ({
  border: '1px solid #2C2C2C',
  borderRadius: '10px',
  padding: '16px',
  paddingBottom: 0,
  backgroundColor: 'transparent',
  marginTop: '8px',
}));

const getTokenLogoUrl = (symbol?: string) => {
  switch (symbol) {
    case 'ETH':
      return ethLogo;
    case 'ARC':
      return arcLogo;
    case 'WETH':
      return wethLogo;
    default:
      return undefined;
  }
};

const Balance = ({ symbol, balance }: { symbol: string; balance?: CurrencyAmount<Currency> }) => (
  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
    <Box display="flex" alignItems="center">
      <img src={getTokenLogoUrl(symbol)} alt={symbol} style={{ width: 24, height: 24, borderRadius: '100%' }} />
      <Typography sx={{ paddingLeft: 1, color: 'white', fontSize: '14px', fontWeight: 600 }}>{symbol}</Typography>
    </Box>
    {balance && (
      <Typography fontWeight={600} variant="body2">
        {balance.toSignificant(4)}
      </Typography>
    )}
  </Box>
);

interface IProfileModalProps {
  web3Modal: any;
  username?: string;
  wallet: string;
  photoUrl?: string;
}

export default function ProfileModal({ web3Modal, username, wallet, photoUrl }: IProfileModalProps) {
  const navigate = useNavigate();
  const { instance, dispatch: web3Dispatch, chainId = 1, account } = useWeb3();
  const dispatch = useAppDispatch();
  const isProfileModalOpen = useModalOpen(ApplicationModal.PROFILE);
  const toggleProfileModal = useProfileModalToggle();

  const ethBalance = useETHBalances(account ? [account] : [])?.[account ?? ''];

  const balances = useCurrencyBalances(wallet, [new Token(1, WETH_ADDRESS[chainId], 18, 'WETH', 'WETH')]);

  const disconnect = useCallback(async () => {
    await web3Modal.clearCachedProvider();
    if (instance?.disconnect && typeof instance.disconnect === 'function') {
      await instance.disconnect();
    }
    if (web3Dispatch) {
      AuthService.logout();
      web3Dispatch({ type: 'RESET_WEB3' });
      dispatch(logoutUser());
    }
    toggleProfileModal();
  }, [web3Modal, instance, web3Dispatch, dispatch]);

  if (!wallet) return <></>;

  const handleProfileDetail = () => {
    navigate('/profile');
    toggleProfileModal();
  };

  return (
    <>
      <Button onClick={toggleProfileModal} sx={{ minWidth: 60, color: 'white' }} variant="outlined">
        <Typography variant="subtitle2" sx={{ textAlign: 'center', textTransform: 'capitalize' }}>
          View Profile
        </Typography>
        {/* <ProfileLogo photoUrl={photoUrl} /> */}
      </Button>
      <Modal
        open={isProfileModalOpen}
        onClose={toggleProfileModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <StyledProfileModal>
          <IconButton onClick={toggleProfileModal} sx={{ position: 'absolute', top: '30px', right: '30px' }}>
            <Close />
          </IconButton>
          <Box sx={{ display: 'flex' }}>
            <ProfileLogo photoUrl={photoUrl} />
            <Box sx={{ ml: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography fontWeight={600}>{username ? username : shortenAddress(wallet)}</Typography>
            </Box>
          </Box>
          <Box sx={{ marginTop: '40px' }}>
            <Typography sx={{ color: '#8D8D8D', fontSize: '12px', fontWeight: 600 }}>Your wallet</Typography>
            <StyledProfileCard>
              {<Balance symbol="ETH" balance={ethBalance} />}
              {<Balance symbol="WETH" balance={balances[0]} />}
            </StyledProfileCard>
          </Box>
          <Button
            variant="outlined"
            color="primary"
            sx={{
              marginTop: '40px',
              paddingY: '14px',
              width: '100%',
              fontWeight: 600,
              textTransform: 'none',
              color: '#007aff',
            }}
            onClick={handleProfileDetail}
          >
            View profile
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={{
              marginTop: '40px',
              paddingY: '14px',
              width: '100%',
              height: '60px',
              fontWeight: 600,
              textTransform: 'none',
            }}
            onClick={disconnect}
          >
            Disconnect
          </Button>
        </StyledProfileModal>
      </Modal>
    </>
  );
}
