import CollectionOffer from '../dialog/CollectionOffer';
import CollectionOfferConfirm from '../dialog/CollectionOfferConfirm';
import CollectionOfferMade from '../dialog/CollectionOfferMade';
import EarnTrading from '../dialog/EarnTrading';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { Box, Button, CardMedia, Grid, Typography, IconButton, Stack, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import discord from 'assets/Icon/discordGrey.svg';
import ether from 'assets/Icon/ether.svg';
import etherscan from 'assets/Icon/etherScanRound.svg';
import instagram from 'assets/Icon/instagramGrey.svg';
import medium from 'assets/Icon/mediumGrey.svg';
import telegram from 'assets/Icon/telegramGrey.svg';
import defaultBanner from 'assets/default_banner_collection.png';
import TxButton from 'components/TxButton';
import { useExchangeContract } from 'hooks/useContract';
import useWindowDimensions from 'hooks/useWindowDimension';
import { IActivity } from 'interfaces/IActivity';
import { INFTCollection } from 'interfaces/INFTCollection';
import { IOffer } from 'interfaces/IOffer';
import { IResponse } from 'interfaces/IResponse';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { TwitterShareButton } from 'react-share';
import { FacebookIcon, TwitterIcon } from 'react-share';
import { useCancelCollectionOfferMutation } from 'services/activity';
import { useGetCollectionOfferQuery } from 'services/collection';
import { useGetActivityQuery } from 'services/collection';
import { useWalletModalToggle } from 'state/application/hooks';
import { useAppSelector } from 'state/hooks';

type IProps = {
  collectionDetailsData: INFTCollection;
  bannerUrl?: string;
  logoUrl?: string;
  featuredUrl?: string;
};

const StyledBox = styled(Box)`
  position: relative;
  overflow: hidden;
  width: 100%;
  &:before {
    content: '';
    top: 0;
    left: 0;
    right: 0;
    height: 20px;
    position: absolute;
    background: linear-gradient(-45deg, #5eacff, #0fffc1, #7e0fff);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
    filter: blur(20px);
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const CollectionHeader = ({ collectionDetailsData, bannerUrl, logoUrl, featuredUrl }: IProps) => {
  const { width, height } = useWindowDimensions();
  const toggleWalletModal = useWalletModalToggle();
  const [cancelCollectionOffer] = useCancelCollectionOfferMutation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { data: activitiesResponse } = useGetActivityQuery(collectionDetailsData._id);
  const { data: offersResponse } = useGetCollectionOfferQuery(collectionDetailsData._id);

  const [offerModalOpen, setOfferModalOpen] = useState(false);

  const [confirmOfferModalOpen, setConfirmOfferModalOpen] = useState(false);
  const [confirmMadeModalOpen, setConfirmMadeModalOpen] = useState(false);
  const [earnModalOpen, setEarnModalOpen] = useState(false);

  const { isAuthenticated, user } = useAppSelector((state) => state.user);

  const [offerProgress, setOfferProgress] = useState(0);

  const [offerPrice, setOfferPrice] = useState(0);
  const [offerEndDate, setOfferEndDate] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [windowSize, setWindowSize] = useState(0);
  const [cancelling, setCancelling] = useState<boolean>(false);
  const [activityLists, setActivityLists] = useState<IActivity[]>([]);
  const [offerLists, setOfferLists] = useState<IOffer[]>([]);
  const exchangeContract = useExchangeContract();

  useEffect(() => {
    setWindowSize(window.innerWidth);
  }, [window.innerWidth]);

  useEffect(() => {
    setIsMobile(windowSize < 768);
  }, [windowSize]);

  useEffect(() => {
    if (activitiesResponse && activitiesResponse.data) {
      const collectionActivity: IActivity[] = activitiesResponse.data.filter(
        (activity: IActivity) => activity.type === 'OfferCollection'
      );
      setActivityLists(collectionActivity);
    }
    if (offersResponse && offersResponse.data) {
      setOfferLists(offersResponse.data);
    }
  }, [activitiesResponse, offersResponse]);

  useEffect(() => {
    if (offerProgress === 0) {
      // made
      setConfirmOfferModalOpen(false);
      setConfirmMadeModalOpen(false);
    } else if (offerProgress === 1) {
      // loading
      setConfirmOfferModalOpen(true);
      setConfirmMadeModalOpen(false);
    } else if (offerProgress === 2) {
      // finished
      setConfirmOfferModalOpen(false);
      setConfirmMadeModalOpen(true);
    }
  }, [offerProgress]);

  const handleCancelCollectionOffer = async () => {
    const collectionOffer = offerLists.find(
      (offer) => offer.from?.toLowerCase() === user.wallet?.toLowerCase() && offer.type === 'OfferCollection'
    );

    if (collectionDetailsData.offerStatus === 'OFFERED' && collectionOffer) {
      setCancelling(true);

      const key = enqueueSnackbar('Cancelling collection offer...', {
        persist: true,
        variant: 'info',
      });

      try {
        if (exchangeContract && collectionOffer.nonce) {
          const transactionResponse = await exchangeContract.cancelMultipleMakerOrders([collectionOffer.nonce]);
          const receipt = await transactionResponse.wait();
          if (receipt.status) {
            const res: IResponse = await cancelCollectionOffer({
              activityId: collectionOffer._id,
              collectionId: collectionDetailsData._id,
              seller: collectionOffer.to,
              buyer: user.wallet,
              price: collectionOffer.price,
              endDate: collectionOffer.endDate,
            }).unwrap();

            closeSnackbar(key);

            if (res.code === 200) {
              enqueueSnackbar('Successfully cancelled collection offer!', {
                variant: 'info',
              });
              window.location.reload();
            } else {
              enqueueSnackbar('Unsuccessfully cancelled collection offer!', {
                variant: 'info',
              });
            }
          }
        } else {
          enqueueSnackbar('Offer is not correct', {
            variant: 'info',
          });
        }
      } catch (e) {
        closeSnackbar(key);

        enqueueSnackbar('Unsuccessfully cancelled collection offer!', {
          variant: 'info',
        });
        console.log(e);
      }

      setCancelling(false);
    }
  };

  const renderButton = () => {
    const collectionOffer = offerLists.find(
      (offer) => offer.from?.toLowerCase() === user.wallet?.toLowerCase() && offer.type === 'OfferCollection'
    );
    if (isAuthenticated && collectionDetailsData) {
      if (collectionDetailsData.offerStatus === 'OFFERED' && collectionOffer) {
        return (
          <Button
            sx={{
              width: isMobile ? '100%' : 'auto',
              marginRight: 2,
              fontWeight: '700',
              ml: 0,
              borderRadius: '10px',
              px: '16px',
              py: '6px',
              height: '40px',
              textTransform: 'none',
            }}
            size="medium"
            color="error"
            variant="outlined"
            onClick={handleCancelCollectionOffer}
          >
            <Typography variant="body1" sx={{ fontSize: '14px', fontWeight: 900 }}>
              Withdraw collection offer
            </Typography>
          </Button>
        );
      } else {
        return (
          <Button
            sx={{
              width: isMobile ? '100%' : 'auto',
              marginRight: 2,
              fontWeight: '700',
              ml: 0,
              borderRadius: '10px',
              px: '16px',
              py: '6px',
              height: '50px',
            }}
            size="medium"
            color="secondary"
            variant="contained"
            onClick={() => setOfferModalOpen(true)}
          >
            <Typography variant="body1" sx={{ fontSize: '14px', fontWeight: 900 }}>
              Collection offer
            </Typography>
          </Button>
        );
      }
    } else {
      return (
        <Button
          sx={{ width: isMobile ? '100%' : 'auto', marginRight: 2, fontWeight: '700', ml: 0, borderRadius: '10px' }}
          size="medium"
          color="secondary"
          variant="contained"
          onClick={toggleWalletModal}
        >
          <Typography variant="body1" sx={{ fontSize: '14px', fontWeight: 900 }}>
            Connect wallet
          </Typography>
        </Button>
      );
    }
  };

  return (
    <Box>
      <Box sx={{ backgroundColor: 'black', position: 'relative', zIndex: 1 }}>
        <CardMedia component="img" image={bannerUrl || defaultBanner} alt="Banner" sx={{ height: 250, opacity: 0.5 }} />
        <CardMedia
          component="img"
          image={logoUrl}
          alt="logo"
          sx={{
            position: 'absolute',
            width: 150,
            height: 150,
            bottom: -75,
            left: (width || 0) < 850 ? 0 : 60,
            borderRadius: '100%',
            border: '2px solid white',
            backgroundColor: 'white',
          }}
        />
      </Box>
      <StyledBox>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            mt: 3,
            pl: 30,
            pr: 1,
          }}
        >
          {!isMobile && <Box>{renderButton()}</Box>}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'end',
              width: isMobile ? '100%' : '50%',
            }}
          >
            {/* <Box>
                  <IconButton
                    onClick={() => {
                      // window.open(`https://twitter.com/internet/share/${collectionDetailsData._id}`);
                      window.open(`https://twitter.com`);
                    }}
                    sx={{ mr: 0 }}
                  >
                    <CardMedia
                      component="img"
                      image={`/images/socials/twitter.png`}
                      alt="twitter"
                      sx={{ width: '25px', height: '25px', borderRadius: '50%' }}
                    />
                  </IconButton>
                </Box> */}
            <Box>
              <IconButton
                onClick={() => {
                  window.open('https://etherscan.io/address/' + collectionDetailsData.contract);
                }}
                sx={{ mr: 0 }}
              >
                <CardMedia component="img" image={etherscan} alt="etherscan" sx={{ width: '25px', height: '25px' }} />
              </IconButton>
            </Box>
            <>
              {collectionDetailsData.links[0] !== '' && (
                <Box>
                  <IconButton
                    onClick={() => {
                      window.open(collectionDetailsData.links[0]);
                    }}
                    sx={{ mr: 0 }}
                  >
                    <CardMedia
                      component="img"
                      image={`/images/socials/personalsite.png`}
                      alt="personalsite"
                      sx={{ width: '26px', height: '26px', borderRadius: '50%' }}
                    />
                  </IconButton>
                </Box>
              )}
            </>
            <>
              {collectionDetailsData.links[1] !== '' && (
                <Box>
                  <IconButton
                    onClick={() => {
                      window.open(collectionDetailsData.links[1]);
                    }}
                    sx={{ mr: 0 }}
                  >
                    <CardMedia
                      component="img"
                      image={`/images/socials/discord.png`}
                      alt="discord"
                      sx={{ width: '25px', height: '25px', borderRadius: '50%' }}
                    />
                  </IconButton>
                </Box>
              )}
            </>
            <>
              {collectionDetailsData.links[2] !== '' && (
                <Box>
                  <IconButton
                    onClick={() => {
                      window.open(collectionDetailsData.links[2]);
                    }}
                    sx={{ mr: 0 }}
                  >
                    <CardMedia
                      component="img"
                      image={`/images/socials/instagram.png`}
                      alt="instagram"
                      sx={{ width: '25px', height: '25px', borderRadius: '50%' }}
                    />
                  </IconButton>
                </Box>
              )}
            </>
            <>
              {collectionDetailsData.links[3] !== '' && (
                <Box>
                  <IconButton
                    onClick={() => {
                      window.open(collectionDetailsData.links[3]);
                    }}
                    sx={{ mr: 0 }}
                  >
                    <CardMedia
                      component="img"
                      image={`/images/socials/medium.png`}
                      alt="medium"
                      sx={{ width: '25px', height: '25px', borderRadius: '50%' }}
                    />
                  </IconButton>
                </Box>
              )}
            </>
            <>
              {collectionDetailsData.links[4] !== '' && (
                <Box>
                  <IconButton
                    onClick={() => {
                      window.open(collectionDetailsData.links[4]);
                    }}
                    sx={{ mr: 0 }}
                  >
                    <CardMedia
                      component="img"
                      image={`/images/socials/telegram.png`}
                      alt="telegram"
                      sx={{ width: '25px', height: '25px', borderRadius: '50%' }}
                    />
                  </IconButton>
                </Box>
              )}
            </>
          </Box>
        </Box>
        {isMobile && <Box sx={{ mt: 3 }}>{renderButton()}</Box>}
      </StyledBox>
      <Grid container spacing={2} sx={{ px: 3, pt: 6, paddingLeft: 0, paddingRight: 0 }}>
        <Grid item sm={12} md={6}>
          <Typography variant="h5">{collectionDetailsData.name}</Typography>
          <Typography sx={{ pt: 2, fontSize: '14px' }}>{collectionDetailsData.description}</Typography>
        </Grid>
        <Grid item sm={12} md={6} sx={{ width: '100%' }}>
          <Box
            sx={{
              border: 1,
              borderRadius: '10px',
              px: 5,
              py: 3,
              display: 'grid',
              gridGap: '1px 90px',
              gridTemplateColumns: isMobile ? 'auto auto' : 'auto auto auto auto',
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CardMedia component="img" image={ether} alt="ether" sx={{ width: 12, height: 20, mr: 1 }} />
                <Typography fontWeight={700}>
                  {collectionDetailsData.floorPrice ? collectionDetailsData.floorPrice.toFixed(2) : '0.00'}
                </Typography>
              </Box>
              <Typography variant="caption" color="textSecondary" textAlign="center">
                Floor Price
              </Typography>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CardMedia component="img" image={ether} alt="ether" sx={{ width: 12, height: 20, mr: 1 }} />
                <Typography fontWeight={700}>
                  {collectionDetailsData.volume
                    ? collectionDetailsData.volume.toFixed(2)
                    : collectionDetailsData.totalVolume
                    ? collectionDetailsData.totalVolume.toFixed(2)
                    : '0.00'}
                </Typography>
              </Box>
              <Typography variant="caption" color="textSecondary" textAlign="center">
                Total Vol
              </Typography>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography fontWeight={700}>
                  {collectionDetailsData.owners ? collectionDetailsData.owners : '0'}
                </Typography>
              </Box>
              <Typography variant="caption" color="textSecondary" textAlign="center">
                Owners
              </Typography>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography fontWeight={700}>
                  {collectionDetailsData.items ? collectionDetailsData.items : '0'}
                </Typography>
              </Box>
              <Typography variant="caption" color="textSecondary" textAlign="center">
                Items
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/*  Collection Offer Dialog */}
      {offerModalOpen && collectionDetailsData && isAuthenticated && user && (
        <CollectionOffer
          collection={collectionDetailsData}
          isOpen={offerModalOpen}
          onDismiss={() => setOfferModalOpen(false)}
          setOfferProgress={setOfferProgress}
          offerPrice={offerPrice}
          setOfferPrice={(offerPrice) => setOfferPrice(offerPrice)}
          setOfferEndDate={(offerEndDate) => setOfferEndDate(offerEndDate)}
          account={user.wallet}
        />
      )}
      {/* Confirm Collection Offer Dialog */}
      {confirmOfferModalOpen && (
        <CollectionOfferConfirm isOpen={confirmOfferModalOpen} onDismiss={() => setConfirmOfferModalOpen(false)} />
      )}
      {/* Confirm Collection Made Dialog */}
      {confirmMadeModalOpen && collectionDetailsData && (
        <CollectionOfferMade
          isOpen={confirmMadeModalOpen}
          onDismiss={() => setConfirmMadeModalOpen(false)}
          collection={collectionDetailsData}
          offerPrice={offerPrice}
          offerEndDate={offerEndDate}
        />
      )}
      {/* Earn Trading Rewards Dialog */}
      {earnModalOpen && <EarnTrading isOpen={earnModalOpen} onDismiss={() => setEarnModalOpen(false)} />}
    </Box>
  );
};
export default CollectionHeader;
