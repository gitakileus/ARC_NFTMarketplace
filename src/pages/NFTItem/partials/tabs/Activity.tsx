import { Box, Divider, Stack, styled, Typography, CardMedia } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Ether from 'assets/Icon/ether.svg';
import Badge from 'components/Badge';
import { EVENT_TYPES } from 'config/eventType';
import { IActivity } from 'interfaces/IActivity';
import { INFT } from 'interfaces/INFT';
import React, { useEffect, useState, MouseEvent } from 'react';
import { useGetHistoryQuery } from 'services/item';
import { calculateTime, compareFloorPrice, shortenAddress } from 'utils';

interface IProps {
  nft: INFT;
}

const RoundedText = styled(Typography)(() => ({
  display: 'inline-block',
  border: '1px solid #101010',
  // borderColor: '#101010',
  borderRadius: 10,
  padding: 10,
  margin: 5,
  cursor: 'pointer',

  ':hover': { background: '#1E1E1E' },
}));

const Activity = ({ nft }: IProps) => {
  const {
    data: ActivityResponse,
    isFetching,
    isLoading,
  } = useGetHistoryQuery({ contract: nft.collectionId, index: nft.index });
  const [activities, setActivities] = useState<IActivity[] | null>(null);
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [filteredItems, setFilteredItems] = useState<IActivity[] | null>();
  const [sizeWidth, setSizeWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isShow, setIsShow] = useState<boolean>(false);

  const handleMoreButton = (e: MouseEvent) => {
    e.stopPropagation();
    setIsShow(!isShow);
  };

  useEffect(() => {
    setSizeWidth(window.innerWidth);
  }, [window.innerWidth]);

  useEffect(() => {
    setIsMobile(sizeWidth < 768);
  }, [sizeWidth]);

  const handleClick = (eventType: string) => {
    let items = [...eventTypes];
    if (items.includes(eventType)) {
      items = items.filter((x) => x !== eventType);
    } else {
      items.push(eventType);
    }
    setEventTypes(items);
  };

  useEffect(() => {
    if (ActivityResponse && ActivityResponse.success) {
      if (eventTypes.length === 0) {
        setFilteredItems(
          [...ActivityResponse.data].sort(
            (a, b) => (b.startDate ? b.startDate : b.date) - (a.startDate ? a.startDate : a.date)
          )
        );
      } else {
        console.log(ActivityResponse.data);
        setFilteredItems(
          ActivityResponse.data
            .filter((x: IActivity) => {
              if (x.type !== 'Transfer') {
                if (x.type === 'Cancel list') {
                  return eventTypes.includes('Unlisted');
                } else if (x.type === 'Cancel offer') {
                  return eventTypes.includes('Canceled offers');
                } else if (x.type === 'OfferCollection') {
                  return eventTypes.includes('Collection offer');
                }
                return eventTypes.includes(x.type);
              }
              if (x.price && x.price > 0) {
                return eventTypes.includes('Sale');
              }
              return eventTypes.includes('Transfer');
            })
            .sort(
              (a: IActivity, b: IActivity) =>
                (b.startDate ? b.startDate : b.date) - (a.startDate ? a.startDate : a.date)
            )
        );
      }
    }
  }, [eventTypes, ActivityResponse]);

  return (
    <Stack spacing={2} marginY={3}>
      <Box>
        Showing: &nbsp; &nbsp;
        {EVENT_TYPES.map((eventType, index) => (
          <Box
            key={index}
            sx={{
              width: 'fit-content',
              display: 'inline-block',
              py: 1,
              px: 3,
              m: 1,
              border: 1,
              borderColor: eventTypes.includes(eventType) ? '#007AFF' : 'grey.800',
              borderRadius: '6px',
              textAlign: 'center',
              ':hover': {
                cursor: 'pointer',
              },
            }}
            onClick={() => handleClick(eventType)}
          >
            <Typography variant="caption">{eventType}</Typography>
          </Box>
        ))}
      </Box>
      <Stack spacing={2} sx={{ border: 1, borderColor: '#1E1E1E', borderRadius: 3 }} divider={<Divider />}>
        {filteredItems &&
          filteredItems.map((offer: IActivity, index: number) => (
            <Stack key={index} spacing={2} sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                {offer.type !== 'Transfer' ? (
                  <Badge badge={offer.type === 'Cancel list' ? 'Unlisted' : offer.type} />
                ) : (
                  <>{offer.price && <Badge badge={offer.price > 0 ? 'Sale' : 'Transfer'} />}</>
                )}
                <Box sx={{ float: 'right' }}>
                  <Box display="flex">
                    <img src={Ether} alt="token" style={{ width: '10px', height: 'auto', marginRight: 6 }} />
                    <Typography color="text.white" fontWeight={700}>
                      {offer.price} ETH
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              <Typography variant="subtitle2" color="text.secondary">
                from <span style={{ color: 'white' }}>&nbsp; {shortenAddress(offer.from)} &nbsp; </span>
                {offer.to && (
                  <>
                    to <span style={{ color: 'white' }}>&nbsp; {shortenAddress(offer.to)} &nbsp; </span>{' '}
                  </>
                )}
                {calculateTime(offer.startDate || offer.date, Date.now())} ago &nbsp;&nbsp;&nbsp;
                {isMobile && (
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
                )}
              </Typography>
            </Stack>
          ))}
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

export default Activity;
