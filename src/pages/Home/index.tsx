import About from './partials/About';
import FeaturedList from './partials/FeaturedList';
import HotCollection from './partials/HotCollection';
import TopCollections from './partials/TopCollections';
import TrendList from './partials/TrendList';
import { Container, Box } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import StarsBackground from 'components/StarsBackground';
import { INFT } from 'interfaces/INFT';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useGetItemsQuery } from 'services/item';

export default function Home() {
  const { data, isFetching, isLoading } = useGetItemsQuery();
  const [nfts, setNfts] = useState<INFT[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(true);
  useEffect(() => {
    if (data) {
      setNfts(data.data);
    }
  }, [data]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.gtag('event', 'nft_navigate_to_homepage');
  }, []);

  return (
    <>
      <StarsBackground />
      <Container sx={{ pt: 10, pb: 14 }}>{!_.isEmpty(nfts) && <About nfts={nfts} />}</Container>
      <HotCollection />
      <TopCollections setIsLoading={setIsLoadingCollections} />
      {/* <TrendList /> */}
      <FeaturedList />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isFetching || isLoading || isLoadingCollections}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
