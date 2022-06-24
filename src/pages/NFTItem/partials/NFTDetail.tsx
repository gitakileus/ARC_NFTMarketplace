import MakeOfferModal from './modals/MakeOfferModal';
import About from './tabs/About';
import Activity from './tabs/Activity';
import Offers from './tabs/Offers';
import { Box, Button, CardMedia, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import ether from 'assets/Icon/ether.svg';
import etherRed from 'assets/Icon/etherRed.svg';
import TxButton from 'components/TxButton';
import { IActivity } from 'interfaces/IActivity';
import { INFT } from 'interfaces/INFT';
import { INFTCollection } from 'interfaces/INFTCollection';
import React, { useState, useEffect } from 'react';
import { useMakeOfferModalToggle, useModalOpen } from 'state/application/hooks';
import { ApplicationModal } from 'state/application/reducer';

interface IProps {
  collection: INFTCollection;
  nft: INFT;
  offers: IActivity[];
  account: any;
  isAuthenticated: boolean;
  onBuyNow: () => void;
  buying: boolean;
}

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
const NFTDetail = (props: IProps) => {
  const { collection, nft, account, offers, isAuthenticated, onBuyNow } = props;
  const [tabValue, setTabValue] = useState(0);
  const [topOffer, setTopOffer] = useState(0);

  const isMakeOfferModalOpen = useModalOpen(ApplicationModal.MAKE_OFFER);
  const toggleMakerOfferModal = useMakeOfferModalToggle();

  const handleTabChange = (e: any, tab: number) => setTabValue(tab);

  const sellOffer = offers.find((x) => x.from.toLowerCase() === nft.owner.toLowerCase());
  const isOwner = nft.owner.toLowerCase() === account?.toLowerCase();
  const isWalletConnected = account && isAuthenticated;

  useEffect(() => {
    if (offers.length > 0) {
      setTopOffer(offers.reduce((x, y) => (x.price > y.price ? x : y)).price);
    }
  }, [offers]);

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', py: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="About" sx={{ px: 1, textTransform: 'none', fontWeight: 600, fontSize: 14 }} />
          <Tab label="Offers" sx={{ px: 1, textTransform: 'none', fontWeight: 600, fontSize: 14 }} />
          <Tab label="Activity" sx={{ px: 1, textTransform: 'none', fontWeight: 600, fontSize: 14 }} />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <About nft={nft} collection={collection} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Offers nft={nft} collection={collection} />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <Activity nft={nft} />
      </TabPanel>
      {/* {isWalletConnected && (
        <>
          <Stack
            p={3}
            mt={4}
            spacing={1}
            alignItems={{ xs: 'left', sm: 'left', md: 'center' }}
            direction={{ xs: 'column', sm: 'column', md: 'row' }}
            justifyContent="space-between"
            sx={{ background: '#1E1E1E', borderRadius: '10px' }}
          >
            <Box>
              <Stack direction="row" mb={1}>
                <Typography variant="subtitle2" color="textSecondary" fontWeight={600}>
                  Price &nbsp;
                </Typography>
                <CardMedia component="img" image={ether} alt="ether" sx={{ width: 10, height: 20 }} />
                <Typography variant="subtitle2" fontWeight={700}>
                  &nbsp; {nft.price}
                </Typography>
              </Stack>
              <Stack direction="row">
                <Typography variant="subtitle2" color="textSecondary" fontWeight={600}>
                  Top offer &nbsp;
                </Typography>
                <CardMedia component="img" image={etherRed} alt="ether" sx={{ width: 10, height: 20 }} />
                <Typography variant="subtitle2" fontWeight={700}>
                  &nbsp; {topOffer}
                </Typography>
              </Stack>
            </Box>

            {!isOwner && (
              <Stack direction="row" spacing={1}>
                {sellOffer && (
                  <TxButton
                    color="secondary"
                    variant="contained"
                    size="medium"
                    sx={{
                      borderRadius: '10px',
                      fontSize: 14,
                      fontWeight: 700,
                      textTransform: 'none',
                      mr: 3,
                      width: '150px',
                    }}
                    onClick={onBuyNow}
                    loading={props.buying}
                  >
                    Buy now
                  </TxButton>
                )}
                <Button
                  size="medium"
                  variant="outlined"
                  sx={{ borderRadius: '10px', fontSize: 14, fontWeight: 700, width: '150px' }}
                  onClick={toggleMakerOfferModal}
                >
                  Make offer
                </Button>
              </Stack>
            )}
          </Stack>
        </>
      )} */}
      <MakeOfferModal
        isOpen={isMakeOfferModalOpen}
        onDismiss={toggleMakerOfferModal}
        collection={collection}
        nft={nft}
        topOffer={topOffer}
        price={nft.price}
        account={account}
        artURI={nft.artURI}
      />
    </Box>
  );
};

export default NFTDetail;
