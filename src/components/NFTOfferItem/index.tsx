import { Avatar, Box, Typography, Button } from '@mui/material';
import Ether from 'assets/Icon/ether.svg';
import TxButton from 'components/TxButton';
import useCancelOfferCallback from 'hooks/useCancelOfferCallback';
import { useExchangeContract } from 'hooks/useContract';
import { INFT } from 'interfaces/INFT';
import { IOffer } from 'interfaces/IOffer';
import AccpetOfferModal from 'pages/NFTItem/partials/modals/AcceptOfferModal';
import React, { useEffect, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCollectionQuery } from 'services/collection';
import { useAcceptOfferModalToggle, useModalOpen } from 'state/application/hooks';
import { ApplicationModal } from 'state/application/reducer';
import { shortenAddress } from 'utils';
import { calculateTime } from 'utils/index';
import { compareFloorPrice } from 'utils/index';

interface IProps {
  offer: IOffer;
  status: number;
}

export default function NFTOfferItem(props: IProps) {
  const navigate = useNavigate();
  const { offer, status } = props;
  const { collection, nftId } = offer;
  const [floorPrice, setFloorPrice] = useState(0);
  const [windowSize, setWindowSize] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [cancelling, setCancelling] = useState<boolean>(false);

  const isAcceptOfferModalOpen = useModalOpen(ApplicationModal.ACCEPT_OFFER);
  const toggleAcceptOfferModal = useAcceptOfferModalToggle();
  const exchangeContract = useExchangeContract();

  const handleCancelOffer = useCancelOfferCallback(offer._id);

  const handleCancel = async () => {
    setCancelling(true);
    if (exchangeContract && offer.nonce) {
      const transactionResponse = await exchangeContract.cancelMultipleMakerOrders([offer.nonce]);
      const receipt = await transactionResponse.wait();
      if (receipt.status) {
        await handleCancelOffer();
      }
    }
    setCancelling(false);
  };

  const handleNFTDetail = () => navigate(`/items/${offer.collection}/${offer.nftId}`);

  const handleMoreButton = (e: MouseEvent) => {
    e.stopPropagation();
    setIsShow(!isShow);
  };

  useEffect(() => {
    setWindowSize(window.innerWidth);
  }, []);

  useEffect(() => {
    setIsMobile(windowSize < 768);
  }, [windowSize]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        cursor: 'pointer',
        borderBottom: 1,
        borderColor: 'grey.800',
        py: 2,
        ':last-child': {
          borderBottom: 0,
        },
        ':first-of-type': {
          paddingTop: 0,
        },
      }}
    >
      <Box display="flex" onClick={() => handleNFTDetail()}>
        {offer.nft && (
          <Avatar
            variant="square"
            src={offer.nft?.artURI}
            sx={{ width: 56, height: 56, borderRadius: '10px', mr: 2 }}
          />
        )}
        <Box display="flex" flexDirection="column" justifyContent="center">
          <Box display="flex" alignItems="center" mb={1}>
            <img src={Ether} alt="token" style={{ height: '15px', width: 'auto' }} />
            <Typography fontWeight={700} fontSize={16}>
              &nbsp; {offer.price}
            </Typography>
            <Typography fontWeight={400} color="textSecondary">
              &nbsp; {compareFloorPrice(Number(offer.price), floorPrice)}
            </Typography>
          </Box>
          <Box display="flex" mb={1}>
            <Typography sx={{ fontWeight: 700 }}>{offer.nft.name}</Typography>
          </Box>
          {isMobile ? (
            <Box display={{ sm: 'block', md: 'flex' }}>
              {offer.startDate && offer.endDate && (
                <Typography variant="body2" color="textSecondary" fontWeight={600}>
                  {calculateTime(offer.startDate, Date.now())} ago &nbsp;
                  <>
                    <span
                      style={{
                        backgroundColor: '#232323',
                        padding: 3,
                        borderRadius: 3,
                        color: '#8d8d8d',
                        fontWeight: 400,
                        fontSize: 12,
                      }}
                      onClick={handleMoreButton}
                    >
                      {isShow ? 'Less -' : 'More +'}
                    </span>
                  </>
                </Typography>
              )}
              {isShow && offer.startDate && offer.endDate && (
                <Typography variant="body2" color="textSecondary" fontWeight={600}>
                  Expiring in &nbsp;
                  {calculateTime(Date.now(), offer.endDate)}
                </Typography>
              )}
              {isShow && offer.from && (
                <Box display="flex" mr={3}>
                  <Typography variant="body2" color="textSecondary">
                    From
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    &nbsp;{shortenAddress(offer.from)}
                  </Typography>
                </Box>
              )}
              {isShow && offer.to && (
                <Box display="flex" mr={3}>
                  <Typography variant="body2" color="textSecondary">
                    To
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    &nbsp; {shortenAddress(offer.to)} &nbsp;
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Box display={{ sm: 'block', md: 'flex' }}>
              {offer.from && (
                <Box display="flex" mr={3}>
                  <Typography variant="body2" color="textSecondary">
                    From
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    &nbsp;{shortenAddress(offer.from)}
                  </Typography>
                </Box>
              )}
              {offer.to && (
                <Box display="flex" mr={3}>
                  <Typography variant="body2" color="textSecondary">
                    To
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    &nbsp; {shortenAddress(offer.to)} &nbsp;
                  </Typography>
                </Box>
              )}
              {offer.startDate && offer.endDate && (
                <Typography variant="body2" color="textSecondary" fontWeight={600}>
                  {calculateTime(offer.startDate, Date.now())} ago &nbsp; Expiring in &nbsp;
                  {calculateTime(Date.now(), offer.endDate)}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>
      {status === 0 ? (
        <Button variant="outlined" color="primary" onClick={toggleAcceptOfferModal}>
          View Offer
        </Button>
      ) : (
        <TxButton variant="outlined" color="error" onClick={handleCancel} loading={cancelling} sx={{ height: '60px' }}>
          Cancel Offer
        </TxButton>
      )}
      <AccpetOfferModal open={isAcceptOfferModalOpen} handleClose={toggleAcceptOfferModal} offer={offer} />
    </Box>
  );
}
