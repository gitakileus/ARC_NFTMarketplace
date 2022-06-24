import GreyDepoLogo from '../../../assets/greyDepoLogo.png';
import { CardMedia, Grid, Typography } from '@mui/material';
import React from 'react';

const About: React.FC = () => (
  <Grid container sx={{ alignItems: 'center' }}>
    <Grid item md={6} sx={{ pt: 10 }}>
      <Typography variant="h3" fontWeight={700} lineHeight={1.5}>
        Stake DePo and <br /> Earn up to up to
        <br />
        <span style={{ color: '#007AFF' }}> 300.56% APR </span>
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" sx={{ pt: 1, pb: 5 }}>
        Stake DePo tokens to earn a share of daily trading fees in WETH, <br /> in addition to even more DePo.
      </Typography>
    </Grid>
    <Grid item md={6}>
      <CardMedia component="img" image={GreyDepoLogo} alt="greenDepo" sx={{ opacity: '50%' }} />
    </Grid>
  </Grid>
);

export default About;
