import { Explicit } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Stack,
  Button,
  Container,
  CardMedia,
  Typography,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import alpha from 'assets/Icon/collection.png';
import wethIcon from 'assets/Icon/weth.png';
import DayChanges from 'components/DayChanges';
import theme from 'config/theme';
import useWindowDimensions from 'hooks/useWindowDimension';
import { INFTCollection } from 'interfaces/INFTCollection';
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGetTopCollectionsQuery } from 'services/collection';
import { shortenString } from 'utils';

const StyledBox = styled(Box)`
  position: relative;
  overflow: hidden;
  &:before {
    content: '';
    top: 0;
    left: -100px;
    right: -100px;
    height: 50px;
    position: absolute;
    background: linear-gradient(-45deg, #5eacff, #0fffc1, #7e0fff);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
    filter: blur(32px);
  }
  &:after {
    content: '';
    bottom: 0;
    left: -100px;
    right: -100px;
    height: 50px;
    position: absolute;
    background: linear-gradient(-45deg, #5eacff, #0fffc1, #7e0fff);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
    filter: blur(32px);
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

interface IProps {
  setIsLoading: (arg: boolean) => void;
}

export default function TopCollections({ setIsLoading }: IProps) {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<INFTCollection[]>([]);
  const { data } = useGetTopCollectionsQuery();
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    if (data && data.success) {
      setCollections(data.data);
      setIsLoading(false);
    }
  }, [data]);

  return (
    <StyledBox sx={{ py: 18, position: 'relative', backgroundColor: '#1A1919' }}>
      <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ mb: 7, textAlign: { xs: 'center', md: 'left' } }}>
          <Typography variant="h4" component="span" color="primary">
            Today&apos;s
          </Typography>{' '}
          top collections
        </Typography>
        {(width || 0) < 512 ? (
          collections.map((collection, index) => (
            <Accordion key={index} sx={{ width: '100%', background: 'transparent' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{ p: 2, alignItems: 'start', m: 0 }}
              >
                <Stack
                  spacing={2}
                  sx={{ width: '100%', mt: -1 }}
                  onClick={() =>
                    _.isEmpty(collection.url)
                      ? navigate(`/collections/id/${collection._id}`)
                      : navigate(`/collections/${collection.url}`)
                  }
                >
                  <Stack direction="row" alignItems="center">
                    <img
                      src={collection.logoUrl}
                      alt=""
                      style={{ width: '35px', height: '35px', borderRadius: '100%' }}
                    />
                    <Typography>&nbsp; {shortenString(collection.name)}</Typography>
                    {collection.isExplicit && <Explicit />}
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography>Total vol</Typography>
                    <Stack direction="row" alignItems="center">
                      <img src={wethIcon} alt="" style={{ width: '20px', height: '20px' }} />
                      <Typography>&nbsp; {collection?.volume ? collection?.volume.toFixed(2) : '0.00'} ETH</Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography>24h vol %</Typography>
                    <DayChanges change={collection._24hPercent} />
                  </Stack>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack sx={{ mt: -3, mr: 3 }} spacing={2}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography>Floor price</Typography>
                    <Stack direction="row" alignItems="center">
                      <img src={wethIcon} alt="" style={{ width: '20px', height: '20px' }} />
                      <Typography>
                        &nbsp; {collection?.floorPrice ? collection?.floorPrice.toFixed(2) : '0.00'} ETH
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography>24h vol</Typography>
                    <Stack direction="row" alignItems="center">
                      <img src={wethIcon} alt="" style={{ width: '20px', height: '20px' }} />
                      <Typography>&nbsp; {collection?._24h ? collection?._24h.toFixed(2) : '0.00'} ETH</Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              mt: 4,
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
              boxShadow: 0,
            }}
          >
            <Table sx={{ background: theme.palette.background.default }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Collection</TableCell>
                  <TableCell>Total vol</TableCell>
                  <TableCell>24h vol %</TableCell>
                  <TableCell>Floor price</TableCell>
                  <TableCell>24h vol</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {collections.map((collection, index) => (
                  <TableRow
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      background: theme.palette.background.default,
                      cursor: 'pointer',
                    }}
                    key={index}
                    onClick={() =>
                      _.isEmpty(collection.url)
                        ? navigate(`/collections/id/${collection._id}`)
                        : navigate(`/collections/${collection.url}`)
                    }
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, minWidth: '200px' }}>
                        <CardMedia
                          component="img"
                          image={collection.logoUrl}
                          sx={{ width: '35px', height: '35px', borderRadius: '100%', m: 1 }}
                        />
                        &nbsp; {collection.name} &nbsp;
                        {collection.isExplicit && <Explicit />}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, minWidth: '100px' }}>
                        <img src={wethIcon} alt="" />
                        &nbsp; {collection?.volume ? collection?.volume?.toFixed(2) : '0.00'} ETH
                      </Box>
                    </TableCell>
                    <TableCell>
                      <DayChanges change={collection._24hPercent} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, minWidth: '100px' }}>
                        <img src={wethIcon} alt="" />
                        &nbsp; {collection?.floorPrice ? collection?.floorPrice?.toFixed(2) : '0.00'} ETH
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, minWidth: '100px' }}>
                        <img src={wethIcon} alt="" />
                        &nbsp; {collection?._24h ? collection?._24h.toFixed(2) : '0.00'} ETH
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Button
          sx={{ width: { xs: '100%', md: 'auto', borderColor: 'white' }, marginTop: 6 }}
          size="large"
          variant="outlined"
          color="primary"
          href="/collections"
        >
          See all collections
        </Button>
      </Container>
    </StyledBox>
  );
}
