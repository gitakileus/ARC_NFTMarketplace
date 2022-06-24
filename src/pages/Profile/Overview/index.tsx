import ProfileCollections from './partials/ProfileCollections';
import ProfileOffers from './partials/ProfileOffers';
import ProfileOverview from './partials/ProfileOverview';
import ProfileOwned from './partials/ProfileOwned';
import { Box, Container, Tab, Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';
import useWindowDimensions from 'hooks/useWindowDimension';
import ProfileActivity from 'pages/Profile/Overview/partials/ProfileActivity';
import React, { useState, useEffect } from 'react';
import { useAppSelector } from 'state/hooks';

const StyledBox = styled(Box)`
  position: relative;
  overflow: hidden;
  width: 100%;
  padding-top: 24px;
  padding-left: 8px;
  padding-right: 8px;
  &:before {
    content: '';
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
    position: absolute;
    background: linear-gradient(-45deg, #5eacff, #0fffc1, #7e0fff);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
    filter: blur(24px);
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

export default function Profile() {
  const [tabValue, setTabValue] = useState(0);
  const { user, isAuthenticated } = useAppSelector((state) => state.user);
  const { width, height } = useWindowDimensions();

  const handleTabChange = (e: any, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!isAuthenticated || !user.wallet) return <></>;

  return (
    <Box>
      <Container>
        <ProfileOverview username={user.username || ''} wallet={user.wallet} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 3,
            px: { xs: 3, sm: 6 },
          }}
        >
          {(width || 0) < 512 ? (
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Owned" sx={{ textTransform: 'none', fontWeight: 550, mr: 2.5 }} />
              <Tab label="Activity" sx={{ textTransform: 'none', fontWeight: 550, mr: 2.5 }} />
              <Tab label="Offers" sx={{ textTransform: 'none', fontWeight: 550, mr: 2.5 }} />
              <Tab label={`Collections (${user.collections})`} sx={{ textTransform: 'none', fontWeight: 550 }} />
            </Tabs>
          ) : (
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Owned" sx={{ textTransform: 'none', fontWeight: 550 }} />
              <Tab label="Activity" sx={{ textTransform: 'none', fontWeight: 550 }} />
              <Tab label="Offers" sx={{ textTransform: 'none', fontWeight: 550 }} />
              <Tab label={`Collections (${user.collections})`} sx={{ textTransform: 'none', fontWeight: 550 }} />
            </Tabs>
          )}
        </Box>
        <StyledBox>
          {tabValue === 0 ? (
            <ProfileOwned address={user.wallet.toLowerCase()} />
          ) : tabValue === 1 ? (
            <ProfileActivity address={user.wallet.toLowerCase()} />
          ) : tabValue === 2 ? (
            <ProfileOffers address={user.wallet.toLowerCase()} />
          ) : tabValue === 3 ? (
            <ProfileCollections address={user.wallet.toLowerCase()} />
          ) : null}
        </StyledBox>
      </Container>
    </Box>
  );
}
