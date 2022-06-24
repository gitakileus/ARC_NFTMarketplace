import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, CardMedia, Grid, Typography } from '@mui/material';
import info from 'assets/Icon/info.svg';
import trading from 'assets/Icon/trading.svg';
import depo from 'assets/logo.png';
import React from 'react';

const TradingRewards: React.FC = () => (
  <Grid container spacing={2} sx={{ mt: 10 }}>
    <Grid item sm={12} md={6} sx={{ display: 'flex', flexDirection: 'col' }}>
      <CardMedia sx={{ width: 40, height: 40, mr: 3 }} component="img" image={trading} alt="trading" />
      <Box>
        <Typography variant="h6" color="text.white" fontWeight={700}>
          Trading Rewards
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Earn trading rewards when you buy or <br /> sell any NFT on DePo. Rewards are <br /> calculated and
          distributed once daily. <br /> <br />
        </Typography>
        <Typography variant="subtitle1" color="text.white" fontWeight={800}>
          1,234,345.89 &nbsp;
          <Typography variant="subtitle1" color="text.secondary" sx={{ display: 'inline-block' }}>
            DePo to be distributed in 23
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ display: 'block' }}>
            hours 16 minutes
          </Typography>
        </Typography>
      </Box>
    </Grid>
    <Grid item sm={12} md={6}>
      {/* Your Stake */}

      <Accordion sx={{ background: 'transparent' }} defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography fontWeight={700}>Rewards &nbsp; </Typography>
            <CardMedia component="img" image={info} alt="info" sx={{ width: '20px', height: '20px' }} />{' '}
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: 'grey.900', borderRadius: 5, p: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              border: 1,
              borderColor: 'grey.800',
              borderRadius: 5,
              p: 3,
              mt: 3,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Box sx={{ display: 'flex', flexDircection: 'col', alignItems: 'center' }}>
                <CardMedia component="img" image={depo} alt="token" sx={{ width: '20px', height: '20px', mr: 2 }} />
                <Typography fontWeight={600}>DEPO</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDircection: 'col',
                  alignItems: 'center',
                  justifyContent: 'right',
                }}
              >
                <Typography fontWeight={700}>1.213435 &nbsp;</Typography>
                <Typography color="#007AFF" fontWeight={700}>
                  &nbsp; Max
                </Typography>
              </Box>
            </Box>
          </Box>
          <Typography
            variant="subtitle2"
            sx={{
              backgroundColor: 'grey.200',
              color: 'black',
              border: 1,
              borderColor: 'grey.800',
              borderRadius: 3,
              p: 3,
              mt: 3,
            }}
          >
            You can collect rewards in the 22 hours between 12:00 PM and 10:00 Am every day. Don’t worry, your rewards
            wont dissapear: they’re just unavailable for those two hours.
          </Typography>
          <Box sx={{ display: 'flex', flex: 'row', justifyContent: 'space-between', mt: 3, mb: 1 }}>
            <Typography>Next distribution:</Typography>
            <Typography>23 hours 16 minutes</Typography>
          </Box>
          <Box sx={{ display: 'flex', flex: 'row', justifyContent: 'space-between', my: 1 }}>
            <Typography>Next Pause:</Typography>
            <Typography>21 hours 16 minutes</Typography>
          </Box>
          <Box sx={{ display: 'flex', flex: 'row', justifyContent: 'space-between', my: 1 }}>
            <Typography>Last collected:</Typography>
            <Typography>--</Typography>
          </Box>
          <Box sx={{ display: 'flex', flex: 'row', justifyContent: 'space-between', my: 1 }}>
            <Typography>Collected to date:</Typography>
            <Typography>--</Typography>
          </Box>
          <Button
            size="large"
            color="secondary"
            variant="contained"
            sx={{ width: '100%', mt: 3, border: 0, fontWeight: 800 }}
          >
            Collect
          </Button>
        </AccordionDetails>
      </Accordion>
    </Grid>
  </Grid>
);

export default TradingRewards;
