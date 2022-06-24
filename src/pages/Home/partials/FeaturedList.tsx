import './owl.css';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Box, Container, Link, Typography } from '@mui/material';
import trending from 'assets/Icon/trending.png';
// import 'bootstrap/dist/css/bootstrap.min.css';
import theme from 'config/theme';
import { INFT } from 'interfaces/INFT';
import _ from 'lodash';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import OwlCarousel from 'react-owl-carousel';
import { useGetItemsByTagQuery } from 'services/item';

export default function TrendList() {
  const isMobileWidth = useMediaQuery('(max-width:768px)');
  const [featuredNFTs, setFeaturedNFTs] = useState<INFT[]>([]);
  const { data } = useGetItemsByTagQuery('featured');
  useEffect(() => {
    if (data && data.success) {
      setFeaturedNFTs(data.data);
    }
  }, [data]);

  const renderFeaturedList = () => {
    return (
      !_.isEmpty(featuredNFTs) && (
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
              &nbsp; Featured NFTs
            </Typography>
            <img alt="featured" src={trending} style={{ width: '25px', height: '25px' }} />
            {featuredNFTs.map((item, index) => (
              <Link
                key={index}
                href={`/items/${item.collection}/${item.index}`}
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
      {renderFeaturedList()}
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
        {renderFeaturedList()}
      </Container>
    </Box>
  );
}
