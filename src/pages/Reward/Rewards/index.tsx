import Arc from '../../../assets/Icon/arc-token.png';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Avatar } from '@mui/material';
import { IActivity } from 'interfaces/IActivity';
import React, { useState, useEffect } from 'react';
import { useGetActivitiesQuery } from 'services/activity';
import { useGetRewardQuery } from 'services/reward';
import { useWeb3 } from 'web3';

const useStyles = makeStyles(() => ({
  textfield: {
    '&. MuiOutlinedInput-notchedOutline': {
      border: 'none !important',
    },
  },
}));
export default function RewardRewards() {
  const { account } = useWeb3();
  const { data: activitiesResponse, isFetching, isLoading } = useGetActivitiesQuery();
  const { data: rewardResponse } = useGetRewardQuery(account);
  const [items, setItems] = useState<IActivity[]>([]);
  const [listingReward, setListingReward] = useState(0);
  const [collectedToDate, setCollectedToDate] = useState(0);
  const [rewardToCollect, setRewardToCollect] = useState(0);
  const classes = useStyles();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRewardToCollect(Number(e.target.value));
  };

  useEffect(() => {
    if (activitiesResponse && activitiesResponse.data) {
      setItems(activitiesResponse.data);
    }
  }, [activitiesResponse]);

  useEffect(() => {
    if (rewardResponse && rewardResponse.data) {
      setListingReward(rewardResponse.data.listingReward);
      setCollectedToDate(rewardResponse.data.collectedToDate);
    }
  }, [rewardResponse]);

  return (
    <>
      <div
        style={{
          width: '100%',
          // background: 'linear-gradient(90deg, #a1c4fd 56.04%, #c2e9fb 100%)',
          // borderRadius: '10px',
          marginBottom: '8px',
          fontWeight: '500',
          fontSize: '14px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Listing reward</span>
        <span>My available rewards: {listingReward ? listingReward.toFixed(2) : '0.00'} ARC</span>
      </div>

      <Box
        sx={{
          display: 'flex',
          border: '1px solid #2c2c2c',
          background: '#232323',
          borderRadius: '10px',
          alignItems: 'flex-end',
          mb: '16px',
          p: '16px',
        }}
      >
        <Avatar variant="square" src={Arc} sx={{ width: 32, height: 32, borderRadius: '10px', mr: '8px' }} />
        <span style={{ color: '#ffffff', margin: 'auto' }}>ARC</span>
        <input
          type="text"
          value={rewardToCollect}
          onChange={handleChange}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            font: 'inherit',
            textAlign: 'right',
            outline: 'none',
            width: '100%',
            margin: 'auto',
          }}
        ></input>
        <span
          onClick={() => setRewardToCollect(listingReward)}
          style={{ color: '#007aff', marginLeft: '26px', marginTop: 'auto', marginBottom: 'auto', cursor: 'pointer' }}
        >
          Max
        </span>
      </Box>
      <div
        style={{
          width: '100%',
          padding: '16px',
          background: 'linear-gradient(90deg, #a1c4fd 56.04%, #c2e9fb 100%)',
          borderRadius: '10px',
          marginBottom: '24px',
          fontWeight: '500',
          fontSize: '12px',
          color: '#141313',
        }}
      >
        Claiming will be paused between 04:00am and 07:00am everyday for preview
      </div>

      <div
        style={{
          width: '100%',
          marginBottom: '8px',
          fontWeight: '500',
          fontSize: '14px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Snapshot at</span>
        <span>Daily at 05:00</span>
      </div>
      <div
        style={{
          width: '100%',
          marginBottom: '8px',
          fontWeight: '500',
          fontSize: '14px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Next distribution</span>
        <span>..</span>
      </div>
      <div
        style={{
          width: '100%',
          marginBottom: '8px',
          fontWeight: '500',
          fontSize: '14px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Collected to date:</span>
        <span>{collectedToDate ? collectedToDate.toFixed(2) : '0.00'} ARC</span>
      </div>
      <Button
        sx={{ width: '100%', mt: '54px', fontSize: '16px', pt: '16px', pb: '16px' }}
        size="large"
        variant="contained"
        href=""
        target="_blank"
      >
        Collect
      </Button>
    </>
  );
}
