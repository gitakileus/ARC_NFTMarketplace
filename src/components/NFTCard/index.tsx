import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Box, Card, CardActions, CardContent, CardHeader, CardMedia, Skeleton, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Ether from 'assets/Icon/ether.svg';
import PlatformImage from 'components/PlatformImage';
import theme from 'config/theme';
import * as React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { shortenString } from 'utils';

interface Iprops {
  collectionIcon?: string;
  userIcon?: string;
  collectionTitle?: string;
  cardImage?: string;
  cardName?: string;
  cardType?: string;
  cardPrice?: string;
  saleStatus?: string;
  platform?: string;
}

export default function NFTCard(props: Iprops) {
  const isMobileWidth = useMediaQuery('(max-width:768px)');
  const { collectionIcon, userIcon, collectionTitle, cardImage, cardName, cardType, cardPrice, saleStatus, platform } =
    props;

  return (
    <Card
      sx={{
        background: '#2A2829',
        borderRadius: '10px',
        minHeight: '100%',
        px: 3,
        py: 2,
        width: '100%',
      }}
    >
      <CardHeader
        sx={{ paddingX: 0 }}
        avatar={
          <CardMedia sx={{ width: '32px', height: '32px' }}>
            <LazyLoadImage
              alt="art"
              src={collectionIcon}
              width="100%"
              height="100%"
              effect="blur"
              style={{ borderRadius: '100%' }}
            />
          </CardMedia>
        }
        title={
          collectionTitle ? (
            <Typography
              variant="h6"
              color="text.white"
              sx={{ width: '80%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {collectionTitle}
            </Typography>
          ) : (
            <Skeleton variant="text" />
          )
        }
      />
      <CardMedia sx={{ px: 2, py: 2, aspectRatio: '1' }}>
        <LazyLoadImage alt="art" src={cardImage} width="100%" height="100%" effect="blur" style={{ borderRadius: 7 }} />
      </CardMedia>

      <CardContent sx={{ display: 'flex', justifyContent: 'end', paddingX: 1, paddingBottom: 0, wdith: '90%' }}>
        {saleStatus === 'For Sale' && (
          <Typography variant="h6" color="text.secondary">
            Price
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }} disableSpacing>
        {cardName ? (
          <Typography variant="h5" color="text.white">
            {shortenString(cardName)}
          </Typography>
        ) : (
          <Skeleton variant="text" width={100} height={40} />
        )}
        {saleStatus === 'For Sale' && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <img alt="ether" src={Ether} width="15px" height="30px" />
            <Typography variant="h5" color="text.white" alignItems="center">
              {cardPrice ? cardPrice : <Skeleton variant="text" width={20} sx={{ display: 'inline-block' }} />}
            </Typography>
          </Stack>
        )}
      </CardActions>
    </Card>
  );
}
