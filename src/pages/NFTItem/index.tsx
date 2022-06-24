import NFTDetail from './partials/NFTDetail';
import NFTInfo from './partials/NFTInfo';
import { CloseFullscreen, OpenInFull, Refresh, Share } from '@mui/icons-material';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import {
  Box,
  Card,
  CardHeader,
  CardMedia,
  Container,
  Dialog,
  Button,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import { styled } from '@mui/material/styles';
import { MaxUint256 } from '@uniswap/sdk-core';
import etherscan from 'assets/Icon/etherScanRound.svg';
import shareIcon from 'assets/Icon/shareIcon.png';
import GlowEffectContainer from 'components/GlowEffectContainer';
import TxButton from 'components/TxButton';
import {
  ARC721_ADDRESS,
  ARC1155_ADDRESS,
  EXCHANGE_ADDRESS,
  STRATEGY_STANDARD_SALE_FOR_FIXED_PRICE_ADDRESS,
  WETH_ADDRESS,
  TRANSFER_MANAGER_ERC721_ADDRESS,
} from 'constants/addresses';
import { BigNumber, ethers } from 'ethers';
import { useExchangeContract, useERC20TokenContract, useARC721Contract } from 'hooks/useContract';
import useWindowDimensions from 'hooks/useWindowDimension';
import { IActivity } from 'interfaces/IActivity';
import { INFT } from 'interfaces/INFT';
import { INFTCollection } from 'interfaces/INFTCollection';
import _, { isUndefined } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { TwitterShareButton } from 'react-share';
import { FacebookIcon, TwitterIcon } from 'react-share';
import { useDeleteActivityMutation, useBuyNowMutation } from 'services/activity';
import { useGetCollectionQuery } from 'services/collection';
import { useGetItemQuery, useGetOffersQuery, useUpdateMutation } from 'services/item';
import { useAppSelector } from 'state/hooks';
import { shortenString } from 'utils';
import signMakeOrder from 'utils/signMakeOrder';
import { useWeb3 } from 'web3';

const StyledShare = styled(Button, {
  name: 'StyledShare',
  slot: 'Wrapper',
})({
  padding: 0,
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const NFTItem = () => {
  const navigate = useNavigate();
  const { width, height } = useWindowDimensions();
  const { contract, index } = useParams();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [buyNow] = useBuyNowMutation();
  const [item, setItem] = useState<INFT | null>(null);
  const [collection, setCollection] = useState<INFTCollection | null>(null);
  const [offers, setOffers] = useState<IActivity[]>([]);
  const [open, setOpen] = useState(false);
  // const [nftType, setNftType] = useState('');
  const [windowSize, setWindowSize] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [buying, setBuying] = useState<boolean>(false);

  const {
    data: collectionResponse,
    isFetching: isFetchingCollection,
    isLoading: isLoadingCollection,
  } = useGetCollectionQuery(contract);
  const {
    data: itemResponse,
    isFetching: isFetchingItem,
    isLoading: isLoadingItem,
  } = useGetItemQuery({ contract, index });
  const {
    data: offersResponse,
    isFetching: isFetchingOffer,
    isLoading: isLoadingOffer,
  } = useGetOffersQuery({ contract, index });

  const exchangeContract = useExchangeContract();
  const { provider, chainId, account } = useWeb3();
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const token20Contract = useERC20TokenContract(WETH_ADDRESS[chainId as number]);
  const token721Contract = useARC721Contract();

  const handleApprove = async () => {
    const selloffer = offers.find((offer) => offer.from.toLowerCase() === item?.owner.toLowerCase());
    if (chainId && token20Contract && account && selloffer) {
      try {
        setBuying(true);
        const allowance = await token20Contract.allowance(account, EXCHANGE_ADDRESS[chainId]);
        const sellPrice = ethers.utils.parseEther(selloffer.price.toString());
        if (allowance.lt(sellPrice)) {
          await token20Contract.approve(EXCHANGE_ADDRESS[chainId], MaxUint256.toString());
        }
        await handleBuyNow();
      } catch (e) {
        console.log(e);
      } finally {
        setBuying(false);
      }
    }
  };

  const handleBuyNow = async () => {
    if (exchangeContract && provider && chainId && account && item) {
      const selloffer = offers.find((offer) => offer.from.toLowerCase() === item?.owner.toLowerCase());
      if (selloffer && selloffer.signature) {
        const key = enqueueSnackbar('Buying Item...', {
          persist: true,
          variant: 'info',
        });

        try {
          const takeOrder = {
            isOrderAsk: false,
            taker: account,
            price: ethers.utils.parseEther(selloffer.price.toString()),
            tokenId: item.index,
            minPercentageToAsk: 9000,
            params: [],
          };
          const makeOrder = {
            isOrderAsk: true,
            signer: item.owner,
            collection: ARC721_ADDRESS[chainId],
            price: ethers.utils.parseEther(selloffer.price.toString()),
            tokenId: item.index,
            amount: 1,
            strategy: STRATEGY_STANDARD_SALE_FOR_FIXED_PRICE_ADDRESS[chainId],
            currency: WETH_ADDRESS[chainId],
            nonce: selloffer.nonce,
            startTime: Math.floor(selloffer.startDate / 1000),
            endTime: Math.floor(selloffer.endDate / 1000),
            minPercentageToAsk: 9000,
            params: [],
            r: selloffer.signature.r,
            s: selloffer.signature.s,
            v: selloffer.signature.v,
          };
          const transactionResponse = await exchangeContract.matchAskWithTakerBidUsingETHAndWETH(takeOrder, makeOrder, {
            value: takeOrder.price,
          });

          const receipt = await transactionResponse.wait(); //wait till transaction is minded
          if (receipt.status) {
            const retUpdateVal = await buyNow({
              collectionId: item.collectionId,
              nftId: item.index,
              seller: item.owner,
              buyer: account,
              price: +selloffer.price,
            }).unwrap();

            closeSnackbar(key);

            if (retUpdateVal.code === 200) {
              enqueueSnackbar('You purchased an item successfully!', {
                variant: 'info',
              });
              window.gtag('event', 'nft_purchased');
              navigate(`/collections/id/${collection?._id}`);
            } else {
              enqueueSnackbar('Something went wrong with your purchase!', {
                variant: 'info',
              });
            }
          } else {
            closeSnackbar(key);
            enqueueSnackbar('Your transaction is failed', {
              variant: 'info',
            });
          }
        } catch (e: any) {
          closeSnackbar(key);

          if (e.code === ethers.errors.INSUFFICIENT_FUNDS) {
            enqueueSnackbar('Insufficient ETH balance!', {
              variant: 'info',
            });
          } else {
            enqueueSnackbar('Something went wrong with your purchase!', {
              variant: 'info',
            });
          }
        }
      }
    }
  };

  useEffect(() => {
    if (itemResponse && itemResponse.data) {
      setItem(itemResponse.data);
      // const itemType: string = itemResponse.data.artURI.split('.').pop();
      // if (itemType === 'jpg' || itemType === 'png' || itemType === 'bmp' || itemType === 'jpeg') setNftType('image');
      // else if (itemType === 'avi' || itemType === 'mp4' || itemType === 'mpg') setNftType('video');
      // else if (itemType === 'mp3' || itemType === 'mov' || itemType === 'wmv') setNftType('image');
    }
    if (collectionResponse && collectionResponse.data) {
      setCollection(collectionResponse.data);
    }
    if (offersResponse && offersResponse.data) {
      setOffers(offersResponse.data);
    }
  }, [itemResponse, collectionResponse, offersResponse]);

  useEffect(() => {
    setWindowSize(window.innerWidth);
  }, []);

  useEffect(() => {
    setIsMobile(windowSize < 768);
  }, [windowSize]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!item || !collection) return null;

  return (
    <>
      <Container>
        <Box sx={{ paddingTop: '20px', paddingBottom: '20px', mx: 3 }}>
          <Typography
            variant="subtitle2"
            color="#0070FF"
            fontWeight={700}
            fontSize={12}
            sx={{ cursor: 'pointer' }}
            onClick={() =>
              _.isEmpty(collection.url)
                ? navigate(`/collections/id/${collection._id}`)
                : navigate(`/collections/${collection.url}`)
            }
          >
            {collection.name}
          </Typography>
          <Typography fontSize={24} fontWeight={700} paddingY={2}>
            {(width || 0) < 512 ? shortenString(item.name) : item.name}
          </Typography>
        </Box>
        <Grid container spacing={10} justifyContent="center">
          <Grid
            sm={12}
            md={6}
            order={{ xs: 2, sm: 2, md: 1 }}
            sx={{ paddingLeft: isMobile ? 10 : 10, paddingTop: isMobile ? 3 : 10 }}
          >
            <NFTInfo
              collection={collection}
              nft={item}
              offers={offers}
              account={account}
              isAuthenticated={isAuthenticated}
              onBuyNow={handleApprove}
              buying={buying}
            />
            <NFTDetail
              collection={collection}
              nft={item}
              offers={offers}
              account={account}
              isAuthenticated={isAuthenticated}
              onBuyNow={handleApprove}
              buying={buying}
            />
          </Grid>
          <Grid item sm={12} md={5.5} order={{ xs: 1, sm: 1, md: 2 }} sx={{ mx: 2 }}>
            <GlowEffectContainer>
              <Card sx={{ background: '#1e1e1e', border: 'none', boxShadow: 'none' }}>
                <CardHeader
                  avatar={
                    <IconButton aria-label="full">
                      <OpenInFull onClick={() => setOpen(true)} />
                    </IconButton>
                  }
                  action={
                    <Box display="flex" alignItems="center">
                      <IconButton aria-label="refresh">
                        <Refresh />
                      </IconButton>
                      <IconButton
                        aria-label="share"
                        onClick={() => {
                          window.open(`
                            https://twitter.com/share?url=${encodeURIComponent(
                              window.location.href
                            )}/&text=Check%20out%20this%20NFT%20on%20ARC!`);
                        }}
                      >
                        <CardMedia component="img" image={shareIcon} sx={{ width: 20, height: 20 }} />
                      </IconButton>
                      <IconButton
                        aria-label="etherscan"
                        onClick={() => {
                          window.open('https://etherscan.io/address/' + item.collection);
                        }}
                      >
                        <CardMedia component="img" image={etherscan} sx={{ width: 20, height: 20 }} />
                      </IconButton>
                    </Box>
                  }
                />
                <CardMedia
                  component={item.contentType === 'Video' ? 'video' : 'img'}
                  className="classes.media"
                  image={item.artURI}
                />
              </Card>
            </GlowEffectContainer>
          </Grid>
        </Grid>
      </Container>
      <Dialog
        fullScreen
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ style: { backgroundColor: 'transparent', boxShadow: 'none' } }}
      >
        <IconButton aria-label="refresh" sx={{ m: 3, alignSelf: 'end', width: '40px' }}>
          <CloseFullscreen onClick={() => setOpen(false)} />
        </IconButton>
        <Box
          sx={{
            alignSelf: 'center',
            width: '60%',
            position: 'relative',
          }}
        >
          <CardMedia
            component={item.contentType === 'Video' ? 'video' : 'img'}
            className="classes.media"
            image={item.artURI}
            alt="art"
            sx={{
              // position: 'absolute',
              p: 1,
              height: '100%',
              width: '100%',
              borderRadius: 10,
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />

          <Box sx={{ m: 3, position: 'absolute', bottom: 1 }}>
            <Typography>{item.name}</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {item.description}
            </Typography>
          </Box>
        </Box>
      </Dialog>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={
          isFetchingCollection ||
          isLoadingCollection ||
          isFetchingItem ||
          isLoadingItem ||
          isFetchingOffer ||
          isLoadingOffer ||
          false
        }
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default NFTItem;
