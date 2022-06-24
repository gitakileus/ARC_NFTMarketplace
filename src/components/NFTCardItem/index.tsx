import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  Typography,
  Skeleton,
} from '@mui/material';
import Ether from 'assets/Icon/ether.svg';
import etherRed from 'assets/Icon/etherRed.svg';
import PlatformImage from 'components/PlatformImage';
import theme from 'config/theme';
import { ICollection } from 'interfaces/ICollection';
import { INFT, INFTCollectionDetails } from 'interfaces/INFT';
import { INFTCollection } from 'interfaces/INFTCollection';
import { IOffer } from 'interfaces/IOffer';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useNavigate } from 'react-router-dom';
import { useGetCollectionQuery } from 'services/collection';
import { shortenString } from 'utils';

interface IProps {
  nft: INFT;
  collectionObj?: INFTCollection;
  collection_details?: INFTCollectionDetails;
  isCollectionPage?: boolean;
}

export default function NFTCardItem(props: IProps) {
  const navigate = useNavigate();
  const { nft, collection_details, collectionObj, isCollectionPage } = props;
  const { collection } = nft;
  const { data: collectionResponse } = useGetCollectionQuery(collection);
  const [collectionDetails, setCollectionDetails] = useState<INFTCollection>();
  const [offers, setOffers] = useState<IOffer[]>();
  const [topOffer, setTopOffer] = useState<number | null>(0);
  useEffect(() => {
    if (collectionResponse && collectionResponse.success === true) {
      setCollectionDetails(collectionResponse.data);
    }
  }, [collectionResponse]);

  useEffect(() => {
    setOffers(nft.offer_lists);
  }, [nft]);

  useEffect(() => {
    if (offers && offers.length > 0) {
      if (offers.length === 1) {
        setTopOffer(offers[0].price);
      } else {
        setTopOffer(offers.reduce((x, y) => (x.price > y.price ? x : y)).price);
      }
    } else setTopOffer(0);
  }, [offers]);

  return (
    <Grid
      item
      xs={6}
      md={6}
      lg={4}
      xl={3}
      sx={{ textAlign: '-webkit-center', textAlignLast: 'right', cursor: 'pointer', width: '100%', minHeight: '100%' }}
    >
      <Card
        sx={{
          background: theme.palette.secondary.main,
          borderRadius: '10px',
          minHeight: '100%',
        }}
        onClick={() => navigate(`/items/${nft.collection}/${nft.index}`)}
      >
        <CardHeader
          sx={{
            p: 2,
            '.MuiCardHeader-content': {
              width: '50%',
            },
          }}
          avatar={
            <CardMedia sx={{ width: '32px', height: '32px' }}>
              <LazyLoadImage
                alt="art"
                src={collection_details?.logoURL || collectionDetails?.logoUrl}
                width="100%"
                height="100%"
                effect="blur"
                style={{ borderRadius: '100%' }}
              />
            </CardMedia>
          }
          title={
            collection_details?.name || collectionObj?.name || collectionDetails?.name ? (
              <Typography
                variant="caption"
                component="div"
                sx={{
                  textAlignLast: 'left',
                  textAlign: 'left',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {collection_details?.name || collectionObj?.name || collectionDetails?.name}
              </Typography>
            ) : (
              <Skeleton variant="text" />
            )
          }
        />

        <CardMedia sx={{ px: 2, py: 2, aspectRatio: '1' }}>
          <LazyLoadImage
            alt="art"
            src={nft.artURI}
            width="100%"
            height="100%"
            effect="blur"
            style={{ borderRadius: 7 }}
          />
        </CardMedia>

        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', px: 2, mb: 2 }}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="flex-start"
            sx={topOffer !== 0 || nft.price !== 0 ? { maxWidth: '50%' } : { maxWidth: '100%' }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, lineHeight: 1 }}>
              Sale
            </Typography>
            {nft.name ? (
              <Typography
                sx={{
                  fontWeight: 600,
                  lineHeight: 1,
                  maxWidth: '100%',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
                variant="subtitle2"
              >
                {nft.name}
              </Typography>
            ) : (
              <Skeleton variant="text" width={100} height={40} />
            )}
          </Box>

          {nft.saleStatus === 'For Sale' && nft.price !== 0 && (
            <Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="flex-end">
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, lineHeight: 1 }}>
                Price
              </Typography>
              <Typography sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, lineHeight: 1 }}>
                <img alt="ether" src={Ether} style={{ width: '10px', height: 'auto' }} />
                &nbsp; {nft.price.toLocaleString()}
              </Typography>
            </Box>
          )}
          {topOffer !== 0 && nft.saleStatus === 'Not For Sale' && (
            <Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="flex-end">
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, lineHeight: 1 }}>
                Highest offer
              </Typography>
              <Typography sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, lineHeight: 1 }}>
                <img alt="WETH" src={etherRed} style={{ width: '10px', height: 'auto' }} />
                &nbsp; {topOffer?.toLocaleString()}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}
