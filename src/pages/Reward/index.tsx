import RewardAirdropRewards from './AirdropRewards';
import RewardListing from './Listing';
import RewardRewards from './Rewards';
import { Box, Container, Grid, Tab, Tabs, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';

export default function Reward() {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (e: any, newValue: number) => setTabValue(newValue);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Container>
      <Grid container>
        <Grid item md={2}></Grid>
        <Grid item md={8}>
          <Box>
            <Typography variant="h4">Rewards</Typography>
            <Typography sx={{ fontSize: '16px', mt: 2 }} color="text.secondary">
              Earn rewards when you list any NFT on ARC.
              <span style={{ fontWeight: 'bold', color: 'white' }}>
                &nbsp; All rewards are paid in $ARC, please see the FAQ page for details on each of our rewards.
              </span>
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              borderBottom: 1,
              borderColor: 'grey.800',
              my: 3,
              paddingLeft: '32px',
            }}
          >
            <Box sx={{ borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Rewards" />
                <Tab label="Airdrop rewards" />
                <Tab label="Listing" />
              </Tabs>
            </Box>
          </Box>
          {tabValue === 0 && (
            <Box
              sx={{
                bgcolor: '#1E1E1E',
                padding: '32px',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                borderRadius: '10px',
              }}
            >
              <RewardRewards />
            </Box>
          )}
          {tabValue === 1 && (
            <Box
              sx={{
                bgcolor: '#1E1E1E',
                padding: '32px',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                borderRadius: '10px',
              }}
            >
              <RewardAirdropRewards />
            </Box>
          )}
          {tabValue === 2 && (
            <Box
              sx={{
                bgcolor: '#1E1E1E',
                padding: '32px',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                borderRadius: '10px',
              }}
            >
              <RewardListing />
            </Box>
          )}
        </Grid>
        <Grid item md={2}></Grid>
      </Grid>
    </Container>
  );
}
