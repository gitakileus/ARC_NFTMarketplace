import Arc from '../../assets/Icon/arc-token.png';
import { Avatar, Box, Typography } from '@mui/material';
import { IActivity } from 'interfaces/IActivity';
import { INFT } from 'interfaces/INFT';
import { INFTCollection } from 'interfaces/INFTCollection';
import React, { useEffect, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCollectionQuery } from 'services/collection';
import { shortenAddress, shortenString } from 'utils';
import { calculateTime } from 'utils/index';

interface IProps {
  activity: IActivity;
}

export default function RewardNFTItem(props: IProps) {
  const navigate = useNavigate();
  const { activity } = props;
  const { collection, nftId, nft, nftObject } = activity;
  const [item, setItem] = useState<INFT | null>(null);
  const [windowSize, setWindowSize] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(false);
  const { data: collectionResponse } = useGetCollectionQuery(activity.collectionId);
  const [collectionDetails, setCollectionDetails] = useState<INFTCollection>();

  useEffect(() => {
    if (collectionResponse && collectionResponse.success === true) {
      setCollectionDetails(collectionResponse.data);
      console.log('collectionResponse.data', collectionResponse.data);
    }
  }, [collectionResponse]);

  const handleNFTDetail = () => {
    navigate(`/items/${activity.collectionId}/${activity.nftId}`);
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
        width: '100%',
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
          </Box>
          <Box display={{ sm: 'block', md: 'flex' }}>
            <Box display="flex" mr={3}>
              <Typography variant="body2" fontWeight={600}>
                {collectionDetails?.name}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      {activity.price !== 0 && activity.type !== 'Mint' && (
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <Box display="flex" mb={1}>
              <img src={Arc} alt="token" style={{ width: '32px', height: 'auto', marginRight: 6 }} />
              <Typography color="text.white" fontWeight={700} mt="2px">
                {activity.price}
              </Typography>
            </Box>
            <Box display={{ sm: 'block', md: 'flex' }}>
              {activity.endDate && (
                <Typography variant="body2" color="textSecondary" fontWeight={600} style={{ marginRight: 6 }}>
                  {Date.now() < activity.endDate
                    ? `Expiring in ${calculateTime(Date.now(), activity.endDate)}`
                    : `Expired`}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
