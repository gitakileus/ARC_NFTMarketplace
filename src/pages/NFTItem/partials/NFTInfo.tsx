import ListForSaleModal from './modals/ListForSaleModal';
import { Box, Button, CardMedia, Stack, Typography } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import ether from 'assets/Icon/ether.svg';
import etherRed from 'assets/Icon/etherRed.svg';
import TxButton from 'components/TxButton';
import { useExchangeContract } from 'hooks/useContract';
import useFetchEthPrice from 'hooks/useFetchEthPrice';
import { IActivity } from 'interfaces/IActivity';
import { INFT } from 'interfaces/INFT';
import { INFTCollection } from 'interfaces/INFTCollection';
import { IResponse } from 'interfaces/IResponse';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { useDeleteActivityMutation, useCancelListForSaleMutation } from 'services/activity';
import { useGetOwnerQuery } from 'services/owner';
import {
  useWalletModalToggle,
  useModalOpen,
  useListForSaleModalToggle,
  useMakeOfferModalToggle,
} from 'state/application/hooks';
import { ApplicationModal } from 'state/application/reducer';
import { numberWithCommas, shortenAddress } from 'utils';
import { calculateTime } from 'utils/index';

type IProps = {
  collection: INFTCollection;
  nft: INFT;
  offers: IActivity[];
  account: any;
  isAuthenticated: boolean;
  onBuyNow: () => void;
  buying: boolean;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const NFTInfo = (props: IProps) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [cancelListForSale] = useCancelListForSaleMutation();
  const { collection, nft, offers, account, isAuthenticated, onBuyNow } = props;

  const [topOffer, setTopOffer] = useState<number | null>(0);
  const [lastOffer, setLastOffer] = useState<number | null>(0);
  const [lastOfferDate, setLastOfferDate] = useState<number | null>(0);
  const [cancelling, setCancelling] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');

  const isListForSaleModalOpen = useModalOpen(ApplicationModal.LIST_FOR_SALE);
  const toggleListForSaleModal = useListForSaleModalToggle();
  const toggleWalletModal = useWalletModalToggle();
  const toggleMakerOfferModal = useMakeOfferModalToggle();
  const exchangeContract = useExchangeContract();

  const { data: userInfor } = useGetOwnerQuery(nft.owner);

  const sellOffer = offers.find((x) => x.from.toLowerCase() === nft.owner.toLowerCase() && x.type === 'List');
  const isOwner = nft.owner.toLowerCase() === account?.toLowerCase();
  const isWalletConnected = account && isAuthenticated;
  const buttonStyle = { width: '100%', fontWeight: 'bold', my: 2, py: 2, borderRadius: 2, textTransform: 'none' };

  const ETHPrice = useFetchEthPrice();

  useEffect(() => {
    if (userInfor && userInfor.data) {
      setUsername(userInfor.data.username);
    }
  }, [userInfor]);

  useEffect(() => {
    if (offers.length > 0) {
      setTopOffer(offers.reduce((x, y) => (x.price > y.price ? x : y)).price);
      setLastOffer(offers.reduce((x, y) => (x.startDate > y.startDate ? x : y)).price);
      setLastOfferDate(offers.reduce((x, y) => (x.startDate > y.startDate ? x : y)).endDate);
    }
  }, [offers]);

  const handleCancelListForSale = async () => {
    if (exchangeContract && sellOffer) {
      setCancelling(true);

      const key = enqueueSnackbar('Cancelling List...', {
        persist: true,
        variant: 'info',
      });

      try {
        if (sellOffer.nonce) {
          const transactionResponse = await exchangeContract.cancelMultipleMakerOrders([sellOffer.nonce]);
          const receipt = await transactionResponse.wait();
          if (receipt.status) {
            const res: IResponse = await cancelListForSale({
              collectionId: collection._id,
              nftId: nft.index,
              seller: nft.owner,
              activityId: sellOffer._id,
            }).unwrap();

            closeSnackbar(key);

            if (res.code === 200) {
              enqueueSnackbar('You unlisted your item successfully!', {
                variant: 'info',
              });
              window.location.reload();
            } else {
              enqueueSnackbar('Failed to unlist your item!', {
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

        enqueueSnackbar('Failed to unlist your item!', {
          variant: 'info',
        });
        console.log(e);
      }

      setCancelling(false);
    }
  };

  const renderButton = () => {
    if (!isWalletConnected) {
      return (
        <Button sx={buttonStyle} size="large" color="secondary" variant="contained" onClick={toggleWalletModal}>
          Connect wallet
        </Button>
      );
    }
    if (isOwner) {
      if (sellOffer && nft.saleStatus === 'For Sale') {
        return (
          <TxButton
            sx={buttonStyle}
            color="error"
            variant="outlined"
            onClick={handleCancelListForSale}
            loading={cancelling}
          >
            Unlist item
          </TxButton>
        );
      }
      return (
        <Button sx={buttonStyle} color="secondary" variant="contained" onClick={toggleListForSaleModal}>
          List for sale
        </Button>
      );
    }
    if (sellOffer) {
      return (
        <>
          <TxButton sx={buttonStyle} color="secondary" variant="contained" onClick={onBuyNow} loading={props.buying}>
            Buy Now
          </TxButton>
          <Button sx={buttonStyle} variant="outlined" onClick={toggleMakerOfferModal}>
            Make Offer
          </Button>
        </>
      );
    }
    return (
      <Button sx={buttonStyle} variant="outlined" onClick={toggleMakerOfferModal}>
        Make Offer
      </Button>
    );
  };

  return (
    <>
      <Box>
        <Box display="flex" justifyContent="space-between" sx={{ background: '#1E1E1E', borderRadius: '10px', p: 2 }}>
          <Box>
            {sellOffer && (
              <Box>
                <Typography variant="subtitle2" color="textSecondary" fontWeight="600">
                  Price
                </Typography>
                <Box display="flex" alignItems="center" sx={{ pt: 3 }}>
                  <CardMedia component="img" image={ether} alt="ether" sx={{ width: 'auto', height: 32, mr: 1.5 }} />
                  <Box display="flex" alignItems="baseline">
                    <Typography variant="h5" lineHeight={1} fontWeight={700}>
                      {sellOffer.price}
                    </Typography>
                    <Typography variant="subtitle2" lineHeight={1} fontWeight="600">
                      &nbsp; ${numberWithCommas(ETHPrice * sellOffer.price)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
            <Box display="flex" sx={{ pt: 3 }}>
              <Box display="flex" sx={{ mr: 1, pr: 1, borderRight: `1px solid #8d8d8d` }}>
                <Typography variant="subtitle2" color="textSecondary" fontWeight="600">
                  Top offer
                </Typography>
                <CardMedia component="img" image={etherRed} alt="WETH" sx={{ width: '12px', height: '20px', mx: 1 }} />
                <Typography variant="subtitle2" fontWeight="600">
                  {topOffer}
                </Typography>
              </Box>
              <Box display="flex">
                <Typography variant="subtitle2" color="textSecondary" fontWeight="600">
                  Last Offer
                </Typography>
                <CardMedia component="img" image={etherRed} alt="WETH" sx={{ width: '12px', height: '20px', mx: 1 }} />
                <Typography variant="subtitle2" fontWeight="600">
                  {lastOffer}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" sx={{ pt: 3 }}>
              <Stack direction="row" alignItems="center">
                <Box sx={{ position: 'relative', width: 48, height: 32 }}>
                  {nft.ownerDetail && (
                    <img
                      src={collection.logoUrl}
                      alt="owner"
                      width={32}
                      height={32}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        borderRadius: '100%',
                      }}
                    />
                  )}
                  {/* <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                    }}
                  >
                    <PlatformImage platform={collection.platform} />
                  </div> */}
                </Box>
                <Typography variant="subtitle2" color="textSecondary" fontWeight="600" sx={{ mr: 1 }}>
                  Owner:
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="primary"
                  fontWeight="600"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    window.open('https://etherscan.io/address/' + nft.owner);
                  }}
                >
                  {username ? username : shortenAddress(nft.owner)}
                </Typography>
              </Stack>
            </Box>
          </Box>
          {offers.length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="textSecondary" fontWeight="600">
                {lastOfferDate && calculateTime(Date.now(), lastOfferDate) === 'X' ? `` : `Time left ~ `}
                {lastOfferDate && (
                  <span style={{ color: 'white' }}>
                    {calculateTime(Date.now(), lastOfferDate) !== 'X' && calculateTime(Date.now(), lastOfferDate)}
                  </span>
                )}
              </Typography>
            </Box>
          )}
        </Box>
        {renderButton()}
      </Box>
      <ListForSaleModal
        open={isListForSaleModalOpen}
        handleClose={toggleListForSaleModal}
        nft={nft}
        collection={collection}
      />
    </>
  );
};

export default NFTInfo;
