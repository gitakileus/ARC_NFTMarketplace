import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import { styled } from '@mui/material/styles';
import BgBlueEth from 'assets/Icon/bluebgEth.svg';
import TxButton from 'components/TxButton';
import {
  ARC721_ADDRESS,
  EXCHANGE_ADDRESS,
  STRATEGY_STANDARD_SALE_FOR_FIXED_PRICE_ADDRESS,
  WETH_ADDRESS,
  TRANSFER_MANAGER_ERC721_ADDRESS,
} from 'constants/addresses';
import { BigNumber, ethers } from 'ethers';
import { useARC721Contract } from 'hooks/useContract';
import { INFT } from 'interfaces/INFT';
import { INFTCollection } from 'interfaces/INFTCollection';
import { IResponse } from 'interfaces/IResponse';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { useListForSaleMutation, useSignOfferMutation } from 'services/activity';
import { useGetCollectionQuery } from 'services/collection';
import { useGetItemQuery } from 'services/item';
import signMakeOrder from 'utils/signMakeOrder';
import { useWeb3 } from 'web3';

const windowSize = window.innerWidth;
const modalSize = windowSize < 768 ? windowSize - 20 : 580;

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StyledProfileModal = styled('div')(() => ({
  position: 'absolute',
  backgroundColor: '#1E1E1E',
  borderRadius: '10px',
  width: modalSize,
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '40px',
}));

const StyledMenuItem = styled(MenuItem)(() => ({
  borderRadius: '10px',
}));

interface IProps {
  open: boolean;
  handleClose: () => void;
  nft?: INFT;
  collection?: INFTCollection;
  collectionId?: string;
  nftId?: number;
}

export default function ListForSaleModal(props: IProps) {
  const { collection, nft, open, nftId, collectionId, handleClose } = props;
  const [warningModal, setWarningModal] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [listForSale] = useListForSaleMutation();
  const [signOffer] = useSignOfferMutation();
  const [saleMode, setSaleMode] = useState(1);
  const [validity, setValidity] = useState(1);
  const [salePrice, setSalePrice] = useState('0');
  const [auctionPrice, setAuctionPrice] = useState('');
  // const [fee, setFee] = useState('1');
  const [nftItem, setNftItem] = useState<INFT | null>(null);
  const [collectionItem, setCollectionItem] = useState<INFTCollection | null>(null);
  const [isListing, setIsListing] = useState<boolean>(false);
  const { data: itemResponse } = useGetItemQuery({ contract: collectionId, index: nftId });
  const { data: collectionResponse } = useGetCollectionQuery(collectionId);
  const token721Contract = useARC721Contract();

  const { provider, chainId, account } = useWeb3();
  useEffect(() => {
    if (itemResponse && itemResponse.data) {
      setNftItem(itemResponse.data);
    }
    if (collectionResponse && collectionResponse.data) {
      setCollectionItem(collectionResponse.data);
    }
  }, [itemResponse, collectionResponse]);

  const handleListItem = async () => {
    const curCollection = collection ? collection : collectionItem;
    const curNft = nft ? nft : nftItem;

    if (provider && chainId && curCollection && curNft) {
      const key = enqueueSnackbar('Listing Item...', {
        persist: true,
        variant: 'info',
      });

      try {
        const res: IResponse = await listForSale({
          collectionId: curCollection._id,
          nftId: curNft.index,
          seller: curNft.owner,
          price: +salePrice,
          endDate: Date.now() + Number(validity) * 30 * 24 * 3600 * 1000,
          // fee: +fee,
        }).unwrap();
        if (res.success === true) {
          const { data } = res;
          const signer = provider.getSigner();
          const makeOrder = {
            isOrderAsk: true,
            signer: data.from,
            collection: ARC721_ADDRESS[chainId],
            price: ethers.utils.parseEther(data.price.toString()),
            tokenId: curNft.index, // data.nftId
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
          const result = await signOffer({
            id: data._id,
            r: signedMakeOrder.r,
            s: signedMakeOrder.s,
            v: signedMakeOrder.v,
          });
          closeSnackbar(key);
          enqueueSnackbar('Successfully listed your item!', {
            variant: 'info',
          });
          window.gtag('event', 'nft_listed');
          window.location.reload();
        } else {
          closeSnackbar(key);

          enqueueSnackbar(res.status, {
            variant: 'error',
          });
        }
      } catch (e) {
        closeSnackbar(key);
        console.log(e);
        enqueueSnackbar('Failed to list your item!', {
          variant: 'error',
        });
      }
      handleClose();
    }
  };

  const checkSalePrice = async () => {
    const curCollection = collection ? collection : collectionItem;
    if (curCollection && curCollection?.floorPrice * 0.8 > +salePrice) {
      // Show warning message
      setWarningModal(true);
    } else await handleApproveERC721();
  };

  const handleApproveERC721 = async () => {
    const curNft = nft ? nft : nftItem;

    setIsListing(true);
    if (curNft && curNft.mintStatus === 'Lazy Minted') {
      await handleListItem();
    } else if (chainId && token721Contract && account && curNft) {
      try {
        await token721Contract.setApprovalForAll(TRANSFER_MANAGER_ERC721_ADDRESS[chainId], true);
        await handleListItem();
      } catch (e) {
        console.log(e);
      }
    }
    setIsListing(false);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <StyledProfileModal>
          <IconButton onClick={handleClose} sx={{ position: 'absolute', top: '30px', right: '30px' }}>
            <Close />
          </IconButton>
          <Typography variant="subtitle1">List for sale</Typography>
          <Box mt={3}>
            <Box display="flex">
              <CardMedia
                component="img"
                image={nft ? nft.artURI : nftItem?.artURI}
                sx={{ width: '40px', height: '40px', mr: 2, borderRadius: '100%' }}
              />
              <Stack direction="column">
                <Typography variant="body2">{collection ? collection.name : collectionItem?.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {nft ? nft.name : nftItem?.name}
                </Typography>
              </Stack>
            </Box>
          </Box>
          <Box mt={4}>
            <Typography component="p" variant="caption" color="textSecondary" mb={1}>
              Sale type
            </Typography>
            <FormControl sx={{ display: 'flex', mr: 1 }} variant="filled">
              <Select
                sx={{
                  background: '#232323',
                  border: '1px solid #2C2C2C;',
                  borderRadius: 2,
                }}
                value={saleMode}
                disableUnderline
                onChange={(e) => setSaleMode(Number(e.target.value))}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <StyledMenuItem value={1} autoFocus>
                  Fixed Price
                </StyledMenuItem>
                {/* <StyledMenuItem value={2}>Auction</StyledMenuItem> */}
              </Select>
            </FormControl>
          </Box>
          <Box mt={3}>
            <Typography component="p" variant="caption" color="textSecondary" mb={1}>
              Sale price
            </Typography>
            <FormControl sx={{ display: 'flex', mr: 1 }} variant="standard">
              <TextField
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                type="number"
                sx={{
                  background: '#232323',
                  border: '1px solid #2C2C2C;',
                  borderRadius: 2,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img alt="" src={BgBlueEth} style={{ width: '24px', height: '24px', marginRight: 8 }} />
                      <Typography>ETH</Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </Box>
          {saleMode === 2 && (
            <Box mt={3}>
              <Typography component="p" variant="caption" color="textSecondary" mb={1}>
                Auction Price
              </Typography>
              <FormControl sx={{ display: 'flex', mr: 1 }} variant="standard">
                <TextField
                  type="number"
                  value={auctionPrice}
                  onChange={(e) => setAuctionPrice(e.target.value)}
                  sx={{
                    background: '#232323',
                    border: '1px solid #2C2C2C;',
                    borderRadius: 2,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <img alt="" src={BgBlueEth} style={{ width: '24px', height: '24px' }} />
                        <Typography>ETH</Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </Box>
          )}
          <Box mt={3}>
            <Typography component="p" variant="caption" color="textSecondary" mb={1}>
              Validity
            </Typography>
            <FormControl sx={{ display: 'flex', mr: 1 }} variant="filled">
              <Select
                sx={{
                  background: '#232323',
                  border: '1px solid #2C2C2C;',
                  borderRadius: 2,
                }}
                value={validity}
                disableUnderline
                onChange={(e) => setValidity(Number(e.target.value))}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <StyledMenuItem value={1} autoFocus>
                  1 month
                </StyledMenuItem>
                <StyledMenuItem value={2}>2 month</StyledMenuItem>
              </Select>
            </FormControl>
          </Box>
          {/* <Box mt={3}>
            <Typography component="p" variant="caption" color="textSecondary" mb={1}>
              Your fees
            </Typography>
            <FormControl sx={{ display: 'flex', mr: 1 }} variant="standard">
              <TextField
                type="number"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                sx={{
                  background: '#232323',
                  border: '1px solid #2C2C2C;',
                  borderRadius: 2,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography>%</Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </Box> */}
          <TxButton
            variant="contained"
            color="secondary"
            sx={{ width: '100%', paddingY: '14px', mt: 5 }}
            onClick={checkSalePrice}
            loading={isListing}
          >
            List item
          </TxButton>
        </StyledProfileModal>
      </Modal>
      <Dialog
        open={warningModal}
        onClose={() => setWarningModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Your listing price is below 80% of floor price'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to list this item for {salePrice} ETH? The price is below 80% of the collections floor
            price
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWarningModal(false)}>No</Button>
          <Button
            onClick={async () => {
              setWarningModal(false);
              await handleApproveERC721();
            }}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
