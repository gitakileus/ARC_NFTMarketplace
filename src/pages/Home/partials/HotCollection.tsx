import './owl.css';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Box, Container, Link, Typography } from '@mui/material';
import trending from 'assets/Icon/trending.png';
// import 'bootstrap/dist/css/bootstrap.min.css';
import theme from 'config/theme';
import { INFTCollection } from 'interfaces/INFTCollection';
import _ from 'lodash';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import OwlCarousel from 'react-owl-carousel';
import { useGetCollectionsByTagQuery } from 'services/collection';

export default function HotCollection() {
  const isMobileWidth = useMediaQuery('(max-width:768px)');
  const [hotCollections, setHotCollections] = useState<INFTCollection[]>([]);
  const { data } = useGetCollectionsByTagQuery('hot');
  useEffect(() => {
    if (data && data.success) {
      setHotCollections(data.data);
    }
  }, [data]);

  const renderHotCollectionList = () => {
    return (
      !_.isEmpty(hotCollections) && (
        <Box sx={{ display: 'flex', py: 2, justifyContent: 'center' }}>
          <OwlCarousel
            items={20}
            className="owl-theme"
            loop
            autoplay={true}
            dots={false}
            autoplayTimeout={2000}
            autoplaySpeed={4000}
            autoWidth
          >
            <Typography color="primary" sx={{ mr: 1, fontWeight: 600, minWidth: '110px' }}>
              &nbsp; Hot Collections
            </Typography>
            <img alt="trending" src={trending} style={{ width: '25px', height: '25px' }} />
            {hotCollections.map((item, index) => (
              <Link
                key={index}
                href={`/collections/id/${item._id}`}
                sx={{ textDecoration: 'none', color: '#fff' }}
                target="_blank"
              >
                <Typography sx={{ width: 'max-content' }}> &nbsp; {item.name} &nbsp; </Typography>
              </Link>
            ))}
          </OwlCarousel>
        </Box>
      )
    );
  };
  return isMobileWidth ? (
    <Box
      sx={{
        background: '#2A2829',
        position: 'relative',
        px: 2,
        overflowX: 'auto',
        width: '100%',
        '&::-webkit-scrollbar': {
          width: '5px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#121212',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#1E1E1E',
          borderRadius: 2,
        },
      }}
    >
      {renderHotCollectionList()}
    </Box>
  ) : (
    <Box
      sx={{
        background: '#2A2829',
        position: 'relative',
      }}
    >
      <Container
        sx={{
          px: 2,
          overflowX: 'auto',
          width: '100%',
          '&::-webkit-scrollbar': {
            width: '5px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#121212',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#1E1E1E',
            borderRadius: 2,
          },
        }}
      >
        {renderHotCollectionList()}
      </Container>
    </Box>
  );
}
