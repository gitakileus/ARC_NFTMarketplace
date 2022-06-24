import ProfileCollections from './partials/ProfileCollections';
import ProfileOffers from './partials/ProfileOffers';
import ProfileOverview from './partials/ProfileOverview';
import ProfileOwned from './partials/ProfileOwned';
import { Box, Container, Tab, Tabs } from '@mui/material';
import ProfileActivity from 'pages/Profile/Overview/partials/ProfileActivity';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function ProfileShare() {
  const [tabValue, setTabValue] = useState(0);

  const { wallet } = useParams();

  const handleTabChange = (e: any, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!wallet) return <></>;

  return (
    <Container maxWidth="xl">
      <ProfileOverview wallet={wallet} isShare />
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'grey.800',
          my: 3,
        }}
      >
        <Box sx={{ borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Owned" sx={{ textTransform: 'none', fontWeight: 550 }} />
            <Tab label="Activity" sx={{ textTransform: 'none', fontWeight: 550 }} />
            <Tab label="Offers" sx={{ textTransform: 'none', fontWeight: 550 }} />
            <Tab label="Collections" sx={{ textTransform: 'none', fontWeight: 550 }} />
          </Tabs>
        </Box>
      </Box>
      {tabValue === 0 ? (
        <ProfileOwned address={wallet.toLowerCase()} />
      ) : tabValue === 1 ? (
        <ProfileActivity address={wallet.toLowerCase()} />
      ) : tabValue === 2 ? (
        <ProfileOffers address={wallet.toLowerCase()} />
      ) : tabValue === 3 ? (
        <ProfileCollections address={wallet.toLowerCase()} />
      ) : null}
    </Container>
  );
}
