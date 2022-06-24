import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { Ether, Token, CurrencyAmount, Currency } from '@uniswap/sdk-core';
import { MaxUint256 } from '@uniswap/sdk-core';
import ether from 'assets/Icon/ether.svg';
import etherRound from 'assets/Icon/etherRound.svg';
import snoopy from 'assets/snoopy.svg';
import {
  ARC_TOKEN_ADDRESS,
  WETH_ADDRESS,
  EXCHANGE_ADDRESS,
  ARC721_ADDRESS,
  STRATEGY_ANY_ITEM_FROM_COLLECTION_FOR_FIXED_PRICE_ADDRESS,
} from 'constants/addresses';
import { ethers } from 'ethers';
import { useERC20TokenContract } from 'hooks/useContract';
import { INFT } from 'interfaces/INFT';
import { INFTCollection } from 'interfaces/INFTCollection';
import { IResponse } from 'interfaces/IResponse';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { useMakeCollectionOfferMutation } from 'services/activity';
import { useSignOfferMutation } from 'services/activity';
import { useCurrencyBalances } from 'state/wallet/hooks';
import signMakeOrder from 'utils/signMakeOrder';
import { useWeb3 } from 'web3';

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

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

interface IOfferModalProps {
  collection: INFTCollection;
  isOpen: boolean;
  onDismiss: () => void;
  account: string;
  setOfferProgress: (arg: number) => void;
  offerPrice: number;
  setOfferPrice: (offerPrice: number) => void;
  setOfferEndDate: (offerEndDate: number) => void;
}

const CollectionOffer = ({
  collection,
  isOpen,
  onDismiss,
  setOfferProgress,
  offerPrice,
  setOfferPrice,
  setOfferEndDate,
  account,
}: IOfferModalProps) => {
  const [handleMakeCollectionOffer, { error, isLoading }] = useMakeCollectionOfferMutation();
  const [signOffer] = useSignOfferMutation();

  const [offerDuration, setOfferDuration] = useState('1');
  const [isMobile, setIsMobile] = useState(false);
  const [sizeWidth, setSizeWidth] = useState(0);
  const { chainId = 1, provider } = useWeb3();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const token20Contract = useERC20TokenContract(WETH_ADDRESS[chainId as number]);

  const balance = useCurrencyBalances(account, [
    new Token(1, WETH_ADDRESS[chainId], 18, 'WETH', 'WETH'),
    new Token(1, ARC_TOKEN_ADDRESS[chainId], 18, 'ARC', 'ARC'),
  ])[0]?.toSignificant(4);

  useEffect(() => {
    setSizeWidth(window.innerWidth);
  }, [window.innerWidth]);

  useEffect(() => {
    setIsMobile(sizeWidth < 768);
  }, [sizeWidth]);

  React.useEffect(() => {
    if (isLoading) setOfferProgress(1);
  }, [isLoading]);

  const handleApprove = () => {
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
        try {
          token20Contract.allowance(account, EXCHANGE_ADDRESS[chainId]).then((res) => {
            const allowance = res;
            const sellPrice = ethers.utils.parseEther(offerPrice.toString());
            if (allowance.lt(sellPrice)) {
              token20Contract.approve(EXCHANGE_ADDRESS[chainId], MaxUint256.toString()).then((res) => {
                confirmOffer();
              });
            } else {
              confirmOffer();
            }
          });
        } catch (e) {
          console.log(e);
        }
      }
    }
  };
  const confirmOffer = async () => {
    if (provider && chainId) {
      try {
        const res: IResponse = await handleMakeCollectionOffer({
          collectionId: collection._id,
          seller: collection.creator,
          buyer: account,
          price: +offerPrice,
          endDate: Date.now() + Number(offerDuration) * 31 * 24 * 3600 * 1000,
        }).unwrap();
        setOfferEndDate(Date.now() + Number(offerDuration) * 31 * 24 * 3600 * 1000);
        if (res.success) {
          // setIsProcessing(true);
          const { data } = res;
          const signer = provider.getSigner();
          const makeOrder = {
            isOrderAsk: false,
            signer: data.from,
            collection: ARC721_ADDRESS[chainId],
            price: ethers.utils.parseEther(data.price.toString()),
            tokenId: 0, // invalid parameter for collection offer
            amount: 1,
            strategy: STRATEGY_ANY_ITEM_FROM_COLLECTION_FOR_FIXED_PRICE_ADDRESS[chainId],
            currency: WETH_ADDRESS[chainId],
            nonce: data.nonce,
            startTime: Math.floor(data.startDate / 1000),
            endTime: Math.floor(data.endDate / 1000),
            minPercentageToAsk: 9000,
            params: '0x',
          };
          const signedMakeOrder = await signMakeOrder(signer, EXCHANGE_ADDRESS[chainId], makeOrder);
          await signOffer({ id: data._id, r: signedMakeOrder.r, s: signedMakeOrder.s, v: signedMakeOrder.v });
          setOfferProgress(2);
          enqueueSnackbar('You placed your offer successfully!', {
            variant: 'info',
          });
          window.location.reload();
          onDismiss();
        } else {
          enqueueSnackbar(res.status, {
            variant: 'error',
          });
          setOfferProgress(0);
        }
      } catch (e) {
        console.log(e);
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
      maxWidth="xs"
    >
      <CustomDialogTitle id="customized-dialog-title" onClose={onDismiss}>
        Collection offer
      </CustomDialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <CardMedia
            component="img"
            image={collection.logoUrl ? collection.logoUrl : snoopy}
            sx={{ width: '50px', height: '50px' }}
            alt="snoopy"
          />
          <Stack spacing={1} sx={{ borderBottom: 1, borderColor: 'grey.800' }}>
            <Typography variant="body2">{collection.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {collection.items} items
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" justifyContent="space-between" sx={{ my: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Collection floor
          </Typography>

          <Stack direction="row" alignItems="center">
            <CardMedia component="img" image={ether} sx={{ width: '11px', height: '18px' }} alt="token" />
            <Typography variant="caption" fontWeight={600}>
              &nbsp; {collection.floorPrice ? collection.floorPrice.toFixed(3) : '0.000'}
            </Typography>
          </Stack>
        </Stack>
        <Typography
          variant="caption"
          component="div"
          sx={{ background: '#FEF4E5', color: 'black', borderRadius: '10px', p: 2 }}
          gutterBottom
        >
          You are making an offer for any Item in this collection. You will receive the first item for which your offer
          is accepted.
        </Typography>
        <Typography variant="caption" component="div" color="text.secondary" sx={{ mt: 3, mb: 1 }}>
          Offer amount
        </Typography>
        <Stack
          spacing={2}
          sx={{
            border: 1,
            borderColor: 'grey.800',
            borderRadius: '10px',
            p: 3,
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row" justifyContent="space-between">
              <CardMedia component="img" image={etherRound} alt="ETH" sx={{ width: '25px', height: '27px', mr: 2 }} />
              <Typography variant="body2">WETH</Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="right"
              sx={{
                width: '40%',
              }}
            >
              <Input
                value={offerPrice}
                inputProps={{ style: { textAlign: 'right', paddingBottom: '11px' } }}
                onChange={(e: any) => setOfferPrice(e.target.value)}
              />
            </Stack>
          </Stack>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <Typography variant="caption" color="text.secondary">
              Balance
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'right' }}>
              {balance}
            </Typography>
          </Box>
        </Stack>
        <Typography variant="body2" component="div" color="text.secondary" sx={{ mt: 3, mb: 1 }}>
          Offer Duration
        </Typography>
        <Select
          fullWidth
          variant="outlined"
          sx={{ borderRadius: '10px' }}
          value={offerDuration}
          onChange={(e) => setOfferDuration(e.target.value)}
        >
          <MenuItem value="1">1 month</MenuItem>
          <MenuItem value="2">2 month</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', width: '100%' }}>
        <Button
          size="large"
          color="secondary"
          variant="contained"
          sx={{ py: 1, m: 3, fontWeight: 'bold', width: '100%', border: 0 }}
          onClick={handleApprove}
        >
          Make offer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CollectionOffer;
