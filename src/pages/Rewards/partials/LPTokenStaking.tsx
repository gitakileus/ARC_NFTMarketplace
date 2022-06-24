import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CardMedia,
  Grid,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import lptoken from 'assets/Icon/lptoken.svg';
import ether from 'assets/Icon/weth.png';
import depo from 'assets/logo.png';
import React from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const renderTokenPair = (tokenFirst: string, tokenSecond: string) => (
  <Box sx={{ position: 'relative', width: 50, height: 40 }}>
    <CardMedia
      component="img"
      image={tokenFirst}
      alt={tokenFirst}
      sx={{ position: 'absolute', width: 15, height: 15, left: 2, top: 2 }}
    />
    <CardMedia
      component="img"
      image={tokenSecond}
      alt={tokenSecond}
      sx={{ position: 'absolute', width: 25, height: 25, left: 10, top: 10 }}
    />
  </Box>
);

const LPTokenStaking: React.FC = () => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Grid container spacing={2} sx={{ mt: 10 }}>
      <Grid item sm={12} md={6} sx={{ display: 'flex', flexDirection: 'col' }}>
        <CardMedia sx={{ width: 40, height: 40, mr: 3 }} component="img" image={lptoken} alt="lptoken" />
        <Box>
          <Typography variant="h6" color="text.white" fontWeight={700}>
            LP Token Staking
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Discontinued: Unstake Now
          </Typography>
        </Box>
      </Grid>
      <Grid item sm={12} md={6}>
        {/* LP farming */}
        <Accordion sx={{ background: 'transparent' }} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography fontWeight={700}>LP Farming</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: 'grey.900', borderRadius: 5, p: 4 }}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Stake" {...a11yProps(0)} sx={{ mr: 5, textTransform: 'none', fontWeight: 600 }} />
                  <Tab label="Unstake" {...a11yProps(1)} sx={{ textTransform: 'none', fontWeight: 600 }} />
                </Tabs>
              </Box>
              {/* Stake Tab */}
              <TabPanel value={value} index={0}>
                {/* Stake Info Box */}
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
                      {renderTokenPair(depo, ether)}
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
                <Box sx={{ display: 'flex', flex: 'row', justifyContent: 'space-between', mt: 3, mb: 2 }}>
                  <Typography>DEPO_ETH LP in wallet:</Typography>
                  <Typography>34,345</Typography>
                </Box>
                <Box sx={{ display: 'flex', flex: 'row', justifyContent: 'space-between', mb: 3 }}>
                  <Typography>Total Stake</Typography>
                  <Typography>34,345</Typography>
                </Box>
                <Button
                  size="large"
                  color="secondary"
                  variant="contained"
                  sx={{ width: '100%', border: 0, fontWeight: 800 }}
                >
                  Stake
                </Button>
              </TabPanel>
              <Box sx={{ display: 'flex', flex: 'row', justifyContent: 'center', mt: 2 }}>
                <Typography sx={{ fontSize: 12 }} color="text.secondary">
                  Pending Depo rewards will be automatically collected when you stake or unstake.
                </Typography>
              </Box>
              {/* Unstake Tab */}
              <TabPanel value={value} index={1}>
                Item Two
              </TabPanel>
            </Box>
          </AccordionDetails>
        </Accordion>
        {/* Rewards to Collect */}
        <Accordion sx={{ background: 'transparent' }} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography fontWeight={700}>Rewards to Collect</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: 'grey.900', borderRadius: 5, p: 4 }}>
            <Box sx={{ width: '100%' }}>
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
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', flexDircection: 'col', alignItems: 'center', pb: 2 }}>
                    <CardMedia component="img" image={depo} alt="depo" sx={{ width: '20px', height: '20px', mr: 2 }} />
                    <Typography fontWeight={600}>DEPO</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDircection: 'col',
                      alignItems: 'center',
                      justifyContent: 'right',
                      width: '40%',
                      borderBottom: 1,
                      borderColor: 'grey.800',
                      pb: 2,
                    }}
                  >
                    <Typography fontWeight={700}>1.213435 &nbsp;</Typography>
                    <Typography color="#007AFF" fontWeight={700}>
                      &nbsp; Max
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    DePo in wallet
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ textAlign: 'right' }}>
                    49,090.55
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flex: 'row', justifyContent: 'space-between', mt: 3, mb: 2 }}>
                <Typography>Last collected:</Typography>
                <Typography>34,345</Typography>
              </Box>
              <Box sx={{ display: 'flex', flex: 'row', justifyContent: 'space-between', mb: 3 }}>
                <Typography>Collected to date:</Typography>
                <Typography>34,345</Typography>
              </Box>
              <Button
                size="large"
                color="secondary"
                variant="contained"
                sx={{ width: '100%', border: 0, fontWeight: 800 }}
              >
                Unstake & Collect
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

export default LPTokenStaking;
