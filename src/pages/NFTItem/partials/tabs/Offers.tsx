import AccpetOfferModal from '../modals/AcceptOfferModal';
import {
  Box,
  CardMedia,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import acceptIcon from 'assets/Icon/accept.svg';
import cancelIcon from 'assets/Icon/cancel.svg';
import etherRed from 'assets/Icon/etherRed.svg';
import Badge from 'components/Badge';
import { useExchangeContract } from 'hooks/useContract';
import { IActivity } from 'interfaces/IActivity';
import { INFT } from 'interfaces/INFT';
import { INFTCollection } from 'interfaces/INFTCollection';
import { IResponse } from 'interfaces/IResponse';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect, MouseEvent } from 'react';
import { useCancelListForSaleMutation } from 'services/activity';
import { useGetOffersQuery } from 'services/item';
import { useAcceptOfferModalToggle, useModalOpen } from 'state/application/hooks';
import { ApplicationModal } from 'state/application/reducer';
import { compareFloorPrice, shortenAddress } from 'utils';
import { calculateTime } from 'utils/index';
import { useWeb3 } from 'web3';

interface IProps {
  nft: INFT;
  collection: INFTCollection;
}

interface IOfferItemProps {
  offer: IActivity;
  nft: INFT;
  collection: INFTCollection;
  handleClick: (offer: IActivity) => void;
}

const StyledMenuItem = styled(MenuItem)(() => ({
  borderRadius: '10px',
}));

const OfferItem = ({ offer, nft, collection, handleClick }: IOfferItemProps) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [cancelListForSale] = useCancelListForSaleMutation();
  const { account } = useWeb3();
  const [windowSize, setWindowSize] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const toggleAcceptOfferModal = useAcceptOfferModalToggle();
  const exchangeContract = useExchangeContract();
  const [offerArr, setOfferArr] = useState<IActivity[]>([offer]);
  const sellOffer = offerArr.find((x) => x.from.toLowerCase() === nft.owner.toLowerCase() && x.type === 'List');

  const handleCancelListForSale = async () => {
    console.log('KKKKKKKKKKKK handleCancelListForSale is called');
    if (exchangeContract && sellOffer) {
      console.log('sellOffer', sellOffer);
      setDeleting(true);

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

      setDeleting(false);
    }
  };

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
    <Box display="flex" justifyContent="space-between">
      <Stack spacing={2} sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center">
          <CardMedia component="img" image={etherRed} sx={{ width: '15px', height: '30px' }} />
          <Typography variant="subtitle1" fontWeight={700}>
            &nbsp; {offer.price} &nbsp;
          </Typography>
          <Badge badge="Offer" />
          <Typography variant="subtitle2" color="text.secondary">
            &nbsp; {compareFloorPrice(offer.price ?? 0, nft.price)}
          </Typography>
        </Stack>
        {isMobile ? (
          <Typography variant="subtitle2" color="text.secondary">
            from <span style={{ color: 'white' }}>&nbsp; {shortenAddress(offer.from)} &nbsp; </span>{' '}
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
            {isShow && offer.startDate && offer.endDate && (
              <Typography>
                {calculateTime(offer.startDate, Date.now())} ago &nbsp;
                {calculateTime(Date.now(), offer.endDate) === 'X'
                  ? 'Expired!'
                  : 'Expiring in ' + calculateTime(Date.now(), offer.endDate)}
              </Typography>
            )}
          </Typography>
        ) : (
          <Typography variant="subtitle2" color="text.secondary">
            from <span style={{ color: 'white' }}>&nbsp; {shortenAddress(offer.from)} &nbsp; </span>{' '}
            {calculateTime(offer.startDate, Date.now())} ago &nbsp;
            {calculateTime(Date.now(), offer.endDate) === 'X'
              ? 'Expired!'
              : 'Expiring in ' + calculateTime(Date.now(), offer.endDate)}
          </Typography>
        )}
      </Stack>
      {offer.from.toLowerCase() === account?.toLowerCase() ? (
        <Box sx={{ p: 2 }} display="flex" alignItems="center">
          <IconButton onClick={deleting ? () => false : handleCancelListForSale}>
            <img alt="logo" width={16} height={16} src={cancelIcon} />
          </IconButton>
        </Box>
      ) : nft.owner.toLowerCase() === account?.toLowerCase() ? (
        <Box sx={{ p: 2 }} display="flex" alignItems="center">
          <IconButton
            onClick={() => {
              toggleAcceptOfferModal();
              handleClick(offer);
            }}
          >
            <img alt="logo" width={16} height={16} src={acceptIcon} />
          </IconButton>
        </Box>
      ) : null}
    </Box>
  );
};

const Offers = ({ nft, collection }: IProps) => {
  const {
    data: OfferResponse,
    isFetching,
    isLoading,
  } = useGetOffersQuery({ contract: collection._id, index: nft.index });
  const [sort, setSort] = useState(1);
  const [offers, setOffers] = useState<IActivity[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<IActivity>();

  const isAcceptOfferModalOpen = useModalOpen(ApplicationModal.ACCEPT_OFFER);
  const toggleAcceptOfferModal = useAcceptOfferModalToggle();

  useEffect(() => {
    if (OfferResponse && OfferResponse.success) {
      let sorted: IActivity[] = Array.from(OfferResponse.data);
      switch (sort) {
        case 1:
          sorted = sorted.sort((x, y) => x.endDate - y.endDate);
          break;
        case 2:
          sorted = sorted.sort((x, y) => y.startDate - x.startDate);
          break;
        case 3:
          sorted = sorted.sort((x, y) => y.price - x.price);
          break;
        case 4:
          sorted = sorted.sort((x, y) => x.price - y.price);
          break;
      }
      setOffers(sorted);
    }
  }, [sort, OfferResponse]);

  return (
    <Stack spacing={2} marginY={3}>
      <FormControl sx={{ width: 180, display: 'flex' }} variant="filled">
        <Select
          sx={{
            background: '#1E1E1E',
            border: 0,
            borderRadius: 2,
            fontWeight: 600,
          }}
          value={sort}
          disableUnderline
          onChange={(e) => setSort(Number(e.target.value))}
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <StyledMenuItem value={1} autoFocus sx={{ fontWeight: 600 }}>
            Expiring soon
          </StyledMenuItem>
          <StyledMenuItem value={2} sx={{ fontWeight: 600 }}>
            Newest
          </StyledMenuItem>
          <StyledMenuItem value={3} sx={{ fontWeight: 600 }}>
            Price ascending
          </StyledMenuItem>
          <StyledMenuItem value={4} sx={{ fontWeight: 600 }}>
            Price descending
          </StyledMenuItem>
        </Select>
      </FormControl>
      <Stack spacing={2} sx={{ border: 1, borderColor: '#1E1E1E', borderRadius: 3 }} divider={<Divider />}>
        {offers
          .filter((x: IActivity) => x.nftId === nft.index)
          .map((offer: IActivity, index: number) => (
            <OfferItem offer={offer} key={index} nft={nft} collection={collection} handleClick={setSelectedOffer} />
          ))}
        {selectedOffer && (
          <AccpetOfferModal open={isAcceptOfferModalOpen} handleClose={toggleAcceptOfferModal} offer={selectedOffer} />
        )}
      </Stack>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isFetching || isLoading || false}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Stack>
  );
};

export default Offers;
