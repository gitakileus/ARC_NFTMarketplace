import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  CardMedia,
  Dialog,
  Select,
  MenuItem,
  FormControl,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  TextField,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import { Ether, Token, CurrencyAmount, Currency } from '@uniswap/sdk-core';
import { MaxUint256 } from '@uniswap/sdk-core';
import ether from 'assets/Icon/ether.svg';
import etherRed from 'assets/Icon/etherRed.svg';
import etherRound from 'assets/Icon/etherRound.svg';
import TxButton from 'components/TxButton';
import {
  ARC721_ADDRESS,
  EXCHANGE_ADDRESS,
  STRATEGY_STANDARD_SALE_FOR_FIXED_PRICE_ADDRESS,
  WETH_ADDRESS,
} from 'constants/addresses';
import { ARC_TOKEN_ADDRESS } from 'constants/addresses';
import { ethers } from 'ethers';
import { useERC20TokenContract } from 'hooks/useContract';
import { INFT } from 'interfaces/INFT';
import { INFTCollection } from 'interfaces/INFTCollection';
import { IResponse } from 'interfaces/IResponse';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { useMakeItemOfferMutation, useSignOfferMutation } from 'services/activity';
import { useCurrencyBalances } from 'state/wallet/hooks';
import signMakeOrder from 'utils/signMakeOrder';
import { useWeb3 } from 'web3';

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 3 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

interface IConfirmModalProps {
  collection: INFTCollection;
  isOpen: boolean;
  onDismiss: () => void;
  nft: INFT;
  topOffer: number;
  price: number;
  account: string;
  artURI: string;
}

const MakeOfferModal = ({
  isOpen,
  onDismiss,
  nft,
  collection,
  topOffer,
  price,
  account,
  artURI,
}: IConfirmModalProps) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [handleMakeOffer, { error, isLoading }] = useMakeItemOfferMutation();
  const [signOffer] = useSignOfferMutation();

  const [isMobile, setIsMobile] = useState(false);
  const [sizeWidth, setSizeWidth] = useState(0);
  const [period, setPeriod] = useState('1');
  const [offerPrice, setOfferPrice] = useState<string>('0');
  const [makingOffer, setMakingOffer] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { chainId = 1, provider } = useWeb3();
  const balance = useCurrencyBalances(account, [
    new Token(1, WETH_ADDRESS[chainId], 18, 'WETH', 'WETH'),
    new Token(1, ARC_TOKEN_ADDRESS[chainId], 18, 'ARC', 'ARC'),
  ])[0]?.toSignificant(4);
  const token20Contract = useERC20TokenContract(WETH_ADDRESS[chainId as number]);

  useEffect(() => {
    setSizeWidth(window.innerWidth);
  }, [window.innerWidth]);

  useEffect(() => {
    setIsMobile(sizeWidth < 768);
  }, [sizeWidth]);

  const handleApprove = async () => {
    if (provider && chainId) {
      if (Number(offerPrice) > Number(balance)) {
        enqueueSnackbar('Not enough WETH to Make Offer', {
          variant: 'info',
        });
      } else if (Number(offerPrice) <= 0) {
        enqueueSnackbar('Invalid Offer price', {
          variant: 'info',
        });
      } else {
        setMakingOffer(true);
        try {
          const allowance = await token20Contract.allowance(account, EXCHANGE_ADDRESS[chainId]);
          const sellPrice = ethers.utils.parseEther(offerPrice);
          if (allowance.lt(sellPrice)) {
            await token20Contract.approve(EXCHANGE_ADDRESS[chainId], MaxUint256.toString());
          }
          await makeOffer();
        } catch (e) {
          console.log(e);
        } finally {
          setMakingOffer(false);
        }
      }
    }
  };

  const makeOffer = async () => {
    if (provider && chainId) {
      try {
        const res: IResponse = await handleMakeOffer({
          collectionId: collection._id,
          nftId: nft.index,
          seller: nft.owner,
          buyer: account,
          price: offerPrice,
          endDate: Date.now() + Number(period) * 31 * 24 * 3600 * 1000,
        }).unwrap();
        if (res.success) {
          setIsProcessing(true);
          const { data } = res;
          const signer = provider.getSigner();
          const makeOrder = {
            isOrderAsk: false,
            signer: data.from,
            collection: ARC721_ADDRESS[chainId],
            price: ethers.utils.parseEther(data.price.toString()),
            tokenId: nft.index, // data.nftId
            amount: 1,
            strategy: STRATEGY_STANDARD_SALE_FOR_FIXED_PRICE_ADDRESS[chainId],
            currency: WETH_ADDRESS[chainId],
            nonce: data.nonce,
            startTime: Math.floor(data.startDate / 1000),
            endTime: Math.floor(data.endDate / 1000),
            minPercentageToAsk: 9000,
            params: '0x',
          };
          const signedMakeOrder = await signMakeOrder(signer, EXCHANGE_ADDRESS[chainId], makeOrder);
          await signOffer({ id: data._id, r: signedMakeOrder.r, s: signedMakeOrder.s, v: signedMakeOrder.v });
          enqueueSnackbar('You placed your offer successfully!', {
            variant: 'info',
          });
          window.gtag('event', 'nft_offer_made');
          window.location.reload();
        }
        onDismiss();
      } catch (e) {
        console.log(e);
        enqueueSnackbar('Failed to place your offer!', {
          variant: 'info',
        });
      }
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onDismiss}
      aria-labelledby="customized-dialog-title"
      PaperProps={{
        style: !isMobile
          ? { background: '#1E1E1E', minWidth: '500px' }
          : { background: '#1E1E1E', width: '100%', position: 'absolute', bottom: -40, borderRadius: 20 },
      }}
    >
      <CustomDialogTitle id="customized-dialog-title" onClose={onDismiss}>
        Make Offer
        <Box sx={{ display: 'flex', flexDirection: 'row', mt: 3 }}>
          <Box sx={{ borderRadius: 50, width: 75, marginRight: 3 }}>
            <CardMedia component="img" image={artURI} sx={{ borderRadius: 50 }} />
          </Box>
          <Box>
            <Typography>{`${nft.name} : ${collection.name}`}</Typography>
            <Typography color="text.secondary">{collection.name}</Typography>
          </Box>
        </Box>
      </CustomDialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Price</Typography>
            <Stack direction="row">
              <CardMedia component="img" image={ether} alt="ETH" sx={{ width: '10px', height: '20px' }} />
              <Typography>&nbsp; {price}</Typography>
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Top Offer</Typography>
            <Stack direction="row">
              <CardMedia component="img" image={etherRed} alt="ETH" sx={{ width: '10px', height: '20px' }} />
              <Typography>&nbsp; {topOffer}</Typography>
            </Stack>
          </Stack>

          <Typography color="text.secondary" sx={{ pt: 2 }}>
            Offer Amount
          </Typography>
          <Box
            sx={{
              border: 1,
              borderColor: 'grey.800',
              borderRadius: 3,
              p: 3,
              bgcolor: '#232323',
            }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Box sx={{ display: 'flex', flexDircection: 'col', alignItems: 'center' }}>
                <CardMedia component="img" image={etherRed} alt="ETH" sx={{ width: '25px', height: '25px' }} />
                <Typography>&nbsp; WETH</Typography>
              </Box>
              <Stack
                sx={{
                  alignItems: 'end',
                  width: '40%',
                  borderBottom: 1,
                  borderColor: 'grey.800',
                  pb: 1,
                }}
              >
                <TextField
                  variant="standard"
                  value={offerPrice}
                  InputProps={{ disableUnderline: true, style: { textAlignLast: 'end' } }}
                  onChange={(e) => setOfferPrice(e.target.value)}
                />
              </Stack>
            </Stack>
            <Stack direction="row" justifyContent="space-between" sx={{ width: '100%', mt: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Balance
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" sx={{ textAlign: 'right' }}>
                {balance}
              </Typography>
            </Stack>
          </Box>
          <Typography color="text.secondary" sx={{ pt: 2 }}>
            Duration
          </Typography>
          <FormControl variant="filled" sx={{ background: '#232323' }}>
            <Select
              sx={{
                background: '#1E1E1E',
                border: 0,
                borderRadius: 3,
              }}
              value={period}
              disableUnderline
              onChange={(e) => setPeriod(e.target.value)}
              inputProps={{ 'aria-label': 'Without label' }}
              SelectDisplayProps={{
                style: { background: '#2c2c2c' },
              }}
            >
              <MenuItem value={1} autoFocus>
                1 Month
              </MenuItem>
              <MenuItem value={2}>2 Month</MenuItem>
              <MenuItem value={3}>3 Month</MenuItem>
            </Select>
          </FormControl>
          <Box>
            <TxButton
              size="large"
              color="secondary"
              variant="contained"
              sx={{ width: '100%', fontWeight: 800, my: 3, borderRadius: '10px' }}
              onClick={handleApprove}
              loading={makingOffer}
            >
              Make Offer
            </TxButton>
          </Box>
        </Stack>
      </DialogContent>
      <Snackbar
        open={isProcessing}
        autoHideDuration={6000}
        onClose={() => setIsProcessing(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert icon={false} severity="info" onClose={() => setIsProcessing(false)} sx={{ width: '250px' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <CircularProgress size={20} color="secondary" />
            &nbsp; &nbsp; Making Offer
          </Stack>
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default MakeOfferModal;
