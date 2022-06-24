import { Box, Button, Card, CardActionArea, CardMedia, Grid, Typography } from '@mui/material';
import ProfileMDIMG from 'assets/profileMD.png';
import { IPerson } from 'interfaces/IPerson';
import _, { conformsTo } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { shortenAddress } from 'utils';

interface IProps {
  logoUrl?: string;
  bannerUrl?: string;
  name: string;
  currency: string;
  floorPrice: number;
  user: IPerson;
  items: number;
  _id: string;
  url?: string;
}

export default function CollectionCard(props: IProps) {
  const { bannerUrl, name, currency, floorPrice, user, items, _id, url } = props;
  const navigate = useNavigate();
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card sx={{ width: '100%' }}>
        <CardActionArea>
          {bannerUrl ? (
            <CardMedia
              component="img"
              height={280}
              image={bannerUrl}
              sx={{ opacity: 0.5 }}
              onClick={() => (_.isEmpty(url) ? navigate(`/collections/id/${_id}`) : navigate(`/collections/${url}`))}
            />
          ) : (
            <Box
              sx={{ height: 280 }}
              onClick={() => (_.isEmpty(url) ? navigate(`/collections/id/${_id}`) : navigate(`/collections/${url}`))}
            />
          )}
          <Box sx={{ position: 'absolute', bottom: 16, left: 16, width: '89%' }}>
            <Typography sx={{ fontSize: '20px', fontWeight: 700, lineHeight: '30px', mb: 1 }}>{name}</Typography>
            <Typography component="p" variant="caption" sx={{ mb: 2 }}>
              {items} Items |{' '}
              <Typography component="span" variant="caption" fontWeight={700}>
                Floor price: {floorPrice ? floorPrice.toFixed(2) : '0.00'} {currency}
              </Typography>
            </Typography>
            <Box
              sx={{
                padding: '4px',
                display: 'flex',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '100px',
              }}
            >
              <img
                src={user.photoUrl ? user.photoUrl : ProfileMDIMG}
                alt="UserLogo"
                width="32px"
                height="32px"
                style={{ marginRight: '4px', borderRadius: '100%' }}
              />
              <Typography sx={{ alignSelf: 'center', fontSize: '14px', fontWeight: 500, lineHeight: '160%' }}>
                {user.username ? user.username : shortenAddress(user.wallet)}
              </Typography>
            </Box>
            <Button
              sx={{
                marginRight: 2,
                fontWeight: '700',
                ml: 0,
                mt: 2,
                borderRadius: '20px',
                px: '16px',
                py: '6px',
                height: '40px',
              }}
              size="small"
              color="secondary"
              variant="contained"
              onClick={() =>
                _.isEmpty(url) ? navigate(`/collections/id/${_id}/edit`) : navigate(`/collections/${url}/edit`)
              }
            >
              Edit Collection
            </Button>
          </Box>
        </CardActionArea>
      </Card>
    </Grid>
  );
}
