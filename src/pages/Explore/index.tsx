import ExploreActivity from './Activity';
import ExploreItems from './Items';
import { Box, Container, Tab, Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';

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

export default function Explore() {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (e: any, newValue: number) => setTabValue(newValue);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Container sx={{ pb: 0 }}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: { xs: 'left', md: 'center' },
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'grey.800',
          mt: 3,
        }}
      >
        <Box sx={{ borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Items" />
            {/* <Tab label="Activity" /> */}
          </Tabs>
        </Box>
      </Box>
      <StyledBox>{tabValue === 0 ? <ExploreItems /> : <ExploreActivity />}</StyledBox>
    </Container>
  );
}
