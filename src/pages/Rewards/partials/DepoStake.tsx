import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CardMedia,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import info from 'assets/Icon/info.svg';
import ether from 'assets/Icon/weth.png';
import depo from 'assets/logo.png';
import wallet from 'assets/wallet.svg';
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

const DepoStake: React.FC = () => {
  const [value, setValue] = React.useState(0);
  const [rewardToken, setRewardToken] = React.useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Grid container spacing={2} sx={{ mt: 10 }}>
      <Grid item sm={12} md={6} sx={{ display: 'flex', flexDirection: 'col' }}>
        <CardMedia sx={{ width: 40, height: 40, mr: 3 }} component="img" image={wallet} alt="wallet" />
        <Box>
          <Typography variant="h6" color="text.white" fontWeight={700}>
            Depo Staking
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Stake DePo and Earn DePo and ETh
          </Typography>
          <Typography variant="h5" color="text.white" fontWeight={800} marginTop="20px">
            320.60% APR
          </Typography>
        </Box>
      </Grid>
      <Grid item sm={12} md={6}>
        {/* Your Stake */}
        <Accordion sx={{ background: 'transparent' }} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography sx={{ fontWeight: 700 }}>Your Stake</Typography>
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
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDircection: 'col', alignItems: 'center', pb: 2 }}>
                      <CardMedia
                        component="img"
                        image={depo}
                        alt="depo"
                        sx={{ width: '20px', height: '20px', mr: 2 }}
                      />
                      <Typography fontWeight="600">DEPO</Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'col',
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
                <Typography sx={{ my: 3 }}>Your Stake (Compounding):</Typography>
                <Button
                  size="large"
                  color="secondary"
                  variant="contained"
                  sx={{ width: '100%', border: 0, fontWeight: 800 }}
                >
                  Stake
                </Button>
              </TabPanel>
              {/* Unstake Tab */}
              <TabPanel value={value} index={1}>
                Item Two
              </TabPanel>
            </Box>
          </AccordionDetails>
        </Accordion>
        {/* Reward Collect */}
        <Accordion sx={{ background: 'transparent' }} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 700 }}>Rewards to collect &nbsp; </Typography>
              <CardMedia component="img" image={info} alt="info" sx={{ width: '20px', height: '20px' }} />{' '}
            </Box>
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
                  my: 2,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  {/* Select Reward token */}
                  <FormControl sx={{ width: 150, display: 'flex' }} variant="standard">
                    <Select
                      sx={{
                        ':hover': {
                          background: 'transparent',
                        },
                      }}
                      value={rewardToken}
                      disableUnderline
                      onChange={(e) => setRewardToken(e.target.value)}
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value={1} autoFocus>
                        <Box sx={{ display: 'flex', flex: 'row', alignItems: 'center', fontWeight: 600 }}>
                          <img loading="lazy" width="20" src={ether} alt="Ether" />
                          &nbsp; ETH
                        </Box>
                      </MenuItem>
                      <MenuItem value={2}>
                        <Box sx={{ display: 'flex', flex: 'row', alignItems: 'center', fontWeight: 600 }}>
                          <img loading="lazy" width="20" src={depo} alt="Ether" />
                          &nbsp; DEPO
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDircection: 'col',
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
              <Box sx={{ display: 'flex', flex: 'row', justifyContent: 'space-between', my: 2 }}>
                <Typography>Last collected:</Typography>
                <Typography>34,345</Typography>
              </Box>
              <Box sx={{ display: 'flex', flex: 'row', justifyContent: 'space-between', mt: 1, mb: 3 }}>
                <Typography>Collected to date:</Typography>
                <Typography>34,345</Typography>
              </Box>
              <Divider />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  mt: 3,
                }}
              >
                <Box sx={{ display: 'flex', flexDircection: 'col', alignItems: 'center' }}>
                  <CardMedia component="img" image={depo} alt="depo" sx={{ width: '20px', height: '20px', mr: 2 }} />
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
                  <Typography fontWeight={500}>Compounding &nbsp;</Typography>
                  <CardMedia component="img" image={info} alt="info" sx={{ width: '20px', height: '20px', mr: 2 }} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flex: 'row', justifyContent: 'space-between', my: 3 }}>
                <Typography>Earned to date:</Typography>
                <Typography>34,345</Typography>
              </Box>
              <Button
                size="large"
                color="secondary"
                variant="contained"
                sx={{ width: '100%', mt: 3, border: 0, fontWeight: 800 }}
              >
                Collect
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

export default DepoStake;
