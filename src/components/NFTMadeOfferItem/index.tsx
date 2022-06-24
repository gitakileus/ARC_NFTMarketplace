import { Box, Button, Typography } from '@mui/material';
import Ether from 'assets/Icon/ether.svg';
import alpha from 'assets/alpha.png';
import React from 'react';

interface IProps {
  title: string;
  fromAddress?: string;
  toAddress?: string;
  byAddress?: string;
  time: number;
  expiredTime?: number;
  price: number;
  floorPercentage: number;
  offerCnt?: number;
}

export default function NFTMadeOfferItem(props: IProps) {
  const { title, fromAddress, toAddress, byAddress, time, expiredTime, price, floorPercentage, offerCnt } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 1,
        m: 1,
        width: '100%',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'col', alignItems: 'start' }}>
        <img src={alpha} alt="collection" style={{ paddingRight: '16px' }} />
        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingBottom: '4px' }}>
            <img src={Ether} alt="token" style={{ width: '16px', height: '16px' }} />
            <Typography variant="subtitle1" color="text.white">
              {price}&nbsp;
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {floorPercentage}% above floor
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingBottom: '4px' }}>
            <Typography variant="subtitle1" color="text.white" sx={{ fontWeight: 'bold' }}>
              {title}
            </Typography>
            {offerCnt && (
              <Typography variant="subtitle1" color="text.white">
                &nbsp; {offerCnt} offers
              </Typography>
            )}
          </Box>
          {!offerCnt && (
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              {fromAddress && (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    From
                  </Typography>
                  <Typography variant="subtitle2" color="text.white">
                    &nbsp; {fromAddress} &nbsp;
                  </Typography>
                </Box>
              )}
              {toAddress && (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    &nbsp; To
                  </Typography>
                  <Typography variant="subtitle2" color="text.white">
                    &nbsp; {toAddress} &nbsp;
                  </Typography>
                </Box>
              )}
              {byAddress && (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    &nbsp; By
                  </Typography>
                  <Typography variant="subtitle2" color="text.white">
                    &nbsp; {byAddress} &nbsp;
                  </Typography>
                </Box>
              )}
              <Typography variant="subtitle2" color="text.secondary">
                &nbsp; {time} minutes ago &nbsp; Expiring in {expiredTime} months
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      <Box>
        {!offerCnt && (
          <Button variant="outlined" color="error" sx={{ padding: '13px 24px 13px 24px', height: '60px' }}>
            Cancel Offer
          </Button>
        )}
        {offerCnt && (
          <Button variant="outlined" color="primary" sx={{ padding: '13px 24px 13px 24px', height: '60px' }}>
            View offers
          </Button>
        )}
      </Box>
    </Box>
  );
}
