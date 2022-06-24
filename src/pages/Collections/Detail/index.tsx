import CollectionActivity from './CollectionActivity';
import CollectionItems from './CollectionItems';
import CollectionHeader from './components/CollectionHeader';
import ImportList from './components/ImportList';
import { Box, Container, Tab, Tabs } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { INFTCollection } from 'interfaces/INFTCollection';
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useGetCollectionQuery, useGetCollectionByURLQuery } from 'services/collection';

export default function Detail() {
  const { id: _id, url }: any = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const [detail, setDetail] = useState<INFTCollection>();
  const [tabValue, setTabValue] = useState(0);
  const { data: CollectionResponse } = useGetCollectionQuery(_id);
  const { data: CollectionByURLResponse } = useGetCollectionByURLQuery(url);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (_.isEmpty(url)) {
      if (CollectionResponse && CollectionResponse.success === true) {
        setDetail(CollectionResponse.data);
        setIsLoading(false);
      }
    } else {
      if (CollectionByURLResponse && CollectionByURLResponse.success === true) {
        setDetail(CollectionByURLResponse.data);
        setIsLoading(false);
      }
    }
  }, [_id, url, CollectionResponse, CollectionByURLResponse]);

  const handleTabChange = (e: any, newValue: number) => setTabValue(newValue);

  useEffect(() => {
    if (tab === 'activity') setTabValue(1);
  }, [tab]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <Container>
        {/* <ImportList /> */}
        <Box sx={{ px: 0 }}>
          {detail && (
            <CollectionHeader
              collectionDetailsData={detail}
              bannerUrl={detail.bannerUrl}
              logoUrl={detail.logoUrl}
              featuredUrl={detail.featuredUrl}
            />
          )}
          <Box pt={7}>
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
                  <Tab label="Items" />
                  <Tab label="Activity" />
                </Tabs>
              </Box>
            </Box>
            {detail &&
              (tabValue ? (
                <CollectionActivity collectionID={detail?._id} />
              ) : (
                <CollectionItems collectionID={detail?._id} collectionDetails={detail} />
              ))}
          </Box>
        </Box>
      </Container>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
