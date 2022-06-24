import { Avatar, Box, Typography } from '@mui/material';
import Ether from 'assets/Icon/ether.svg';
import Badge from 'components/Badge';
import { IActivity } from 'interfaces/IActivity';
import { INFT } from 'interfaces/INFT';
import React, { useEffect, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCollectionQuery } from 'services/collection';
import { useGetItemQuery } from 'services/item';
import { shortenAddress, shortenString } from 'utils';
import { calculateTime } from 'utils/index';
import { compareFloorPrice } from 'utils/index';

interface IProps {
  activity: IActivity;
}

export default function NFTActivityItem(props: IProps) {
  const navigate = useNavigate();
  const { activity } = props;
  const { collection, nftId, nft, nftObject } = activity;
  // const { data: collectionResponse } = useGetCollectionQuery(collection);
  // const { data: itemResponse } = useGetItemQuery({ contract: collection, index: nftId });
  const [floorPrice, setFloorPrice] = useState(0);
  const [item, setItem] = useState<INFT | null>(null);
  const [windowSize, setWindowSize] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(false);

  const handleNFTDetail = () => {
    navigate(`/items/${activity.collection._id}/${activity.nftId}`);
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
    <Box
      display="flex"
      flexDirection={{ xs: 'column', sm: 'row' }}
      alignItems={{ sm: 'start', md: 'center' }}
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
        width: '85%',
      }}
      onClick={() => handleNFTDetail()}
    >
      <Box display="flex">
        <Avatar
          variant="square"
          src={nft?.artURI || nftObject?.artURI}
          sx={{ width: 56, height: 56, borderRadius: '10px', mr: 2 }}
        />
        <Box display="flex" flexDirection="column" justifyContent="center">
          <Box display="flex" mb={1}>
            <Typography sx={{ fontWeight: 700 }}>
              {shortenString(nft?.name || '') || shortenAddress(nftObject?.name || '')}
            </Typography>
            {activity.type !== 'Transfer' ? (
              <Badge badge={activity.type === 'Cancel list' ? 'Unlisted' : activity.type} />
            ) : (
              <>{activity.price && <Badge badge={activity.price > 0 ? 'Sale' : 'Transfer'} />}</>
            )}
          </Box>
          {!isMobile ? (
            <Box display={{ sm: 'block', md: 'flex' }}>
              {activity.by && (
                <Box display="flex" mr={3}>
                  <Typography variant="body2" color="textSecondary">
                    By
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    &nbsp;{shortenAddress(activity.by)}
                  </Typography>
                </Box>
              )}
              {activity.from && (
                <Box display="flex" mr={3}>
                  <Typography variant="body2" color="textSecondary" style={{ marginRight: 6 }}>
                    From
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {shortenAddress(activity.from)}
                  </Typography>
                </Box>
              )}
              {activity.to && (
                <Box display="flex" mr={3}>
                  <Typography variant="body2" color="textSecondary" style={{ marginRight: 6 }}>
                    To
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {shortenAddress(activity.to)}
                  </Typography>
                </Box>
              )}
              {(activity.startDate || activity.date) && (
                <Typography variant="body2" color="textSecondary" fontWeight={600} style={{ marginRight: 24 }}>
                  {`${calculateTime(activity.date ? activity.date : activity.startDate, Date.now())} ago`}
                </Typography>
              )}
              {activity.type !== 'Cancel offer' && activity.endDate && (
                <Typography variant="body2" color="textSecondary" fontWeight={600} style={{ marginRight: 12 }}>
                  {Date.now() < activity.endDate
                    ? `Expiring in ${calculateTime(Date.now(), activity.endDate)}`
                    : `Expired`}
                </Typography>
              )}
            </Box>
          ) : (
            <Box display={{ sm: 'block', md: 'flex' }}>
              {activity.startDate && activity.endDate && (
                <Typography variant="body2" color="textSecondary" fontWeight={600}>
                  {calculateTime(activity.startDate, Date.now())} ago &nbsp;&nbsp;&nbsp;
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
              {isShow && activity.startDate && activity.endDate && (
                <Typography variant="body2" color="textSecondary" fontWeight={600}>
                  {calculateTime(Date.now(), activity.endDate) === 'X' ? 'Expired' : 'Expiring in '}
                  {calculateTime(Date.now(), activity.endDate) === 'X'
                    ? ''
                    : calculateTime(Date.now(), activity.endDate)}
                </Typography>
              )}
              {isShow && activity.by && (
                <Box display="flex" mr={3}>
                  <Typography variant="body2" color="textSecondary">
                    By
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    &nbsp;{shortenAddress(activity.by)}
                  </Typography>
                </Box>
              )}
              {isShow && activity.from && (
                <Box display="flex" mr={3}>
                  <Typography variant="body2" color="textSecondary">
                    From
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    &nbsp;{shortenAddress(activity.from)}
                  </Typography>
                </Box>
              )}
              {isShow && activity.to && (
                <Box display="flex" mr={3}>
                  <Typography variant="body2" color="textSecondary">
                    To
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    &nbsp; {shortenAddress(activity.to)} &nbsp;
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
      {activity.price !== 0 && activity.type !== 'Mint' && (
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <Box display="flex">
            <img src={Ether} alt="token" style={{ width: '15px', height: 'auto', marginRight: 6 }} />
            <Typography color="text.white" fontWeight={700}>
              {activity.price}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="textSecondary">
              {compareFloorPrice(Number(activity.price), floorPrice)}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
