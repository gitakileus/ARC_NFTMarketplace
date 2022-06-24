import { Box, Button, Grid, Skeleton, Typography } from '@mui/material';
import Ether from 'assets/Icon/ether.svg';
import GlowEffectContainer from 'components/GlowEffectContainer';
import NFTCard from 'components/NFTCard';
import { INFT } from 'interfaces/INFT';
import React, { useCallback, useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { useNavigate } from 'react-router-dom';
import { useGetItemsByTagQuery } from 'services/item';

interface IProps {
  nfts: INFT[];
}

export default function About({ nfts }: IProps) {
  const navigate = useNavigate();
  const [featuredNFT, setFeaturedNFT] = useState<INFT[]>();
  const { data } = useGetItemsByTagQuery('featured');

  useEffect(() => {
    if (data) {
      setFeaturedNFT(data.data);
    }
  }, [data]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Grid container justifyContent="center" spacing={5}>
        <Grid item md={6} sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            sx={{ alignItems: { xs: 'center', sm: 'center', md: 'start' } }}
          >
            <Typography variant="h4" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              The future of NFT marketplaces
            </Typography>
            <Typography variant="body2" sx={{ pt: 3, pb: 7, textAlign: { xs: 'center', md: 'left' } }}>
              Our transaction fees are just 1%, that&apos;s up to 60% lower than competitors. Plus, you can create &
              list your NFTs for free with integrated bulk &quot;lazy minting&quot; technology, or list a popular NFT
              for sale and claim an ARC token airdrop. The ARC token also entitles you to a share of the platform&apos;s
              revenue. Contact ARC&apos;s fully doxxed experts to discuss how we can work together to promote your NFT
              project.
            </Typography>
            <Box>
              <Button
                sx={{ width: { xs: '100%', md: 'auto' }, mr: 2, my: 1 }}
                size="large"
                variant="contained"
                href="/explore"
              >
                Explore NFTs
              </Button>
              <Button
                sx={{ width: { xs: '100%', md: 'auto' }, my: 1, borderColor: 'white' }}
                size="large"
                variant="outlined"
                href="/profile/import"
              >
                List an NFT
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item md={6} sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
          <GlowEffectContainer sx={{ p: 0, m: 0, cursor: 'pointer', width: '-webkit-fill-available' }}>
            {featuredNFT && (
              <Carousel indicators={false} interval={10000} sx={{ width: '100%', borderRadius: '20px' }}>
                {featuredNFT.map((item, index) => (
                  <div key={index} onClick={() => navigate(`/items/${item?.collection}/${item?.index}`)}>
                    <NFTCard
                      collectionIcon={item?.collection_details?.logoURL}
                      userIcon={Ether}
                      collectionTitle={item?.collection_details?.name}
                      cardImage={item?.artURI}
                      cardName={item?.name}
                      cardType={item?.status}
                      saleStatus={item?.saleStatus}
                      cardPrice={item?.price.toLocaleString()}
                      platform={item?.collection_details?.platform}
                    />
                  </div>
                ))}
              </Carousel>
            )}
          </GlowEffectContainer>
        </Grid>
      </Grid>
    </Box>
  );
}
