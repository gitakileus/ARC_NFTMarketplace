import { Box, Button, CardMedia, Grid, Typography } from '@mui/material';
import earnStake from 'assets/Icon/earnStake.svg';
import earnTrade from 'assets/Icon/earnTrade.svg';
import React from 'react';

const EarnWithDepo: React.FC = () => (
  <Grid container spacing={2} sx={{ mt: 10 }}>
    <Grid item xs={12} sm={12} md={12} lg={4}>
      <Typography variant="h4" color="text.white" fontWeight={700} sx={{ my: 2 }}>
        Earn with Depo
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        Depo helps you earn rewards and its sweet.
      </Typography>
      <Button
        sx={{ width: { xs: '100%', md: 'auto' }, marginTop: 3, fontWeight: 'bold' }}
        size="large"
        variant="contained"
      >
        Buy DePo
      </Button>
    </Grid>
    <Grid item xs={12} sm={12} md={6} lg={4}>
      <Box sx={{ backgroundColor: 'grey.900', borderRadius: 5, p: 4, m: 2, height: 330 }}>
        <CardMedia component="img" image={earnStake} alt="earnStake" sx={{ width: 30, height: 30, mb: 3 }} />
        <Typography variant="h6" color="text.white" fontWeight={600}>
          Earn by Staking <br /> <br />
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          100% Depo’s trading fees are redistributed proportionally to DEPO stakers <br /> <br />
          Stake DEPO via this page to earn: <br />
          &nbsp; - WETH trading trading fees <br /> &nbsp; - Extra DEPO
        </Typography>
      </Box>
    </Grid>
    <Grid item xs={12} sm={12} md={6} lg={4}>
      <Box sx={{ backgroundColor: 'grey.900', borderRadius: 5, p: 4, m: 2, height: 330 }}>
        <CardMedia component="img" image={earnTrade} alt="earnTrade" sx={{ width: 30, height: 30, mb: 3 }} />
        <Typography variant="h6" color="text.white" fontWeight={600}>
          Earn by Trading <br /> <br />
        </Typography>
        <Typography variant="subtitle2" color="text.white">
          You earn DEPO everytime you buy or sell an NFT on Depo. <br />
          Rewards ae calculated and distributed once daily <br /> <br />
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          (Private listings excluded)
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

export default EarnWithDepo;
