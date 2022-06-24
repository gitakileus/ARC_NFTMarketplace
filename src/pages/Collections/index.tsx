import useMediaQuery from '@material-ui/core/useMediaQuery';
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
  Typography,
  Grid,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  CardMedia,
} from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import verified from 'assets/Icon/verified.svg';
import weth from 'assets/Icon/weth.png';
import wethIcon from 'assets/Icon/weth.png';
import DayChanges from 'components/DayChanges';
import ChangeIn24Hours from 'components/DayChanges';
import PlatformImage from 'components/PlatformImage';
import theme from 'config/theme';
import useWindowDimensions from 'hooks/useWindowDimension';
import { INFTCollection } from 'interfaces/INFTCollection';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCollectionsQuery } from 'services/collection';
import { shortenString } from 'utils';

export default function Collections() {
  const isMobile = useMediaQuery('(max-width:768px)');

  const navigate = useNavigate();
  const { data, isFetching, isLoading } = useGetCollectionsQuery();
  const [tabValue, setTabValue] = useState(0);
  const [selectOrder, setSelectOrder] = useState(0);
  const [listCount, setListCount] = useState(5);
  const [collections, setCollections] = useState<INFTCollection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<INFTCollection[]>([]);

  const handleTabChange = (e: any, tab: number) => {
    let f;

    if (tab === 1) {
      f = collections.filter((item) => item.isVerified);
    } else {
      f = collections;
    }

    setFilteredCollections(f);
    setTabValue(tab);
    setSelectOrder(0);
  };

  const handleSelectOrder = (value: any) => {
    setSelectOrder(value);
    let filtered = Array.from(filteredCollections);
    switch (value) {
      case 0:
        filtered = filtered.sort((a, b) => b.volume - a.volume);
        break;
      case 1:
        filtered = filtered.sort((a, b) => a._24h - b._24h);
        break;
      case 2:
        filtered = filtered.sort((a, b) => b._24h - a._24h);
        break;
      case 3:
        filtered = filtered.sort((a, b) => a.volume - b.volume);
        break;
    }
    setFilteredCollections(filtered);
  };

  const handleAddList = () => {
    setListCount(listCount + 5);
    handleSelectOrder(selectOrder);
  };

  useEffect(() => {
    if (data && Array.isArray(data.data)) {
      const f = data.data;
      setCollections(f);
      setFilteredCollections(f);
    }
  }, [data]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" sx={{ mx: 1, my: 5, fontSize: isMobile ? '24px' : '56px' }}>
          Collections
        </Typography>
        {/* {(width || 0) < 512 && ( */}
        {isMobile && (
          <Select
            variant="filled"
            value={selectOrder}
            onChange={(e) => handleSelectOrder(e.target.value)}
            sx={{ fontWeight: 600 }}
          >
            <MenuItem value={0} sx={{ fontWeight: 600 }}>
              Highest total Vol
            </MenuItem>
            <MenuItem value={1} sx={{ fontWeight: 600 }}>
              24h vol change Asc
            </MenuItem>
            <MenuItem value={2} sx={{ fontWeight: 600 }}>
              24h vol change Desc
            </MenuItem>
            <MenuItem value={3} sx={{ fontWeight: 600 }}>
              Highest 24h Vol
            </MenuItem>
          </Select>
        )}
      </Stack>

      <Grid container justifyContent="space-between" spacing={2}>
        <Grid item sx={{ position: 'relative' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="All collections" />
            <Tab label="Verified" />
          </Tabs>
          <Box
            sx={{
              position: 'absolute',
              height: '2px',
              left: 16,
              right: 0,
              backgroundColor: '#2c2c2c',
              bottom: isMobile ? '0px' : '12px',
            }}
          ></Box>
        </Grid>
        {/* {(width || 0) > 512 && ( */}
        {!isMobile && (
          <Grid item>
            <Select
              variant="filled"
              value={selectOrder}
              onChange={(e) => handleSelectOrder(e.target.value)}
              sx={{ fontWeight: 600 }}
            >
              <MenuItem value={0} sx={{ fontWeight: 600 }}>
                Highest total Vol
              </MenuItem>
              <MenuItem value={1} sx={{ fontWeight: 600 }}>
                24h vol change Asc
              </MenuItem>
              <MenuItem value={2} sx={{ fontWeight: 600 }}>
                24h vol change Desc
              </MenuItem>
              <MenuItem value={3} sx={{ fontWeight: 600 }}>
                Highest 24h Vol
              </MenuItem>
            </Select>
          </Grid>
        )}
      </Grid>

      {/* {(width || 0) < 512 ? ( */}
      {isMobile ? (
        filteredCollections.slice(0, listCount).map((collection, index) => (
          <Stack
            key={index}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            my={3}
            onClick={() =>
              _.isEmpty(collection.url)
                ? navigate(`/collections/id/${collection._id}`)
                : navigate(`/collections/${collection.url}`)
            }
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <img src={collection.logoUrl} alt="" width={42} height={42} style={{ borderRadius: '100%' }} />

              <Stack spacing={1}>
                <Stack direction="row">
                  <Typography sx={{ fontSize: '14px' }}>{shortenString(collection.name, 10)} &nbsp;</Typography>
                  {collection.isExplicit && <Explicit />}
                </Stack>
                <Stack direction="row" alignItems="center">
                  <Typography sx={{ fontSize: '12px' }}>Floor price &nbsp;</Typography>
                  <CardMedia component="img" image={weth} sx={{ width: '14px', height: '14px' }} />
                  <Typography sx={{ fontSize: '12px' }}>
                    &nbsp; {collection.volume ? collection.volume.toFixed(2) : '0.00'} ETH
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Stack spacing={1} alignItems="start" width="30%">
              <DayChanges change={collection._24hPercent} />
              <Stack direction="row" alignItems="center">
                <CardMedia component="img" image={weth} sx={{ width: '14px', height: '14px' }} />
                <Typography sx={{ fontSize: '12px' }}>
                  &nbsp; {collection.floorPrice ? collection.floorPrice.toFixed(2) : '0.00'} ETH
                </Typography>
              </Stack>
            </Stack>
          </Stack>
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
          }}
        >
          <Table sx={{ background: theme.palette.background.default }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Collection</TableCell>
                <TableCell>Volume</TableCell>
                <TableCell>24h %</TableCell>
                <TableCell>Floor price</TableCell>
                <TableCell>Owners</TableCell>
                <TableCell>Items</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCollections.slice(0, listCount).map((col: INFTCollection, i) => (
                <TableRow
                  key={i}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                  onClick={() =>
                    // _.isEmpty(col.url) ? navigate(`/collections/id/${col._id}`) : navigate(`/collections/${col.url}`)
                    navigate(`/collections/id/${col._id}`)
                  }
                >
                  <TableCell component="th" scope="row" sx={{ minWidth: '300px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                      <CardMedia
                        component="img"
                        image={col.logoUrl}
                        alt="collection"
                        sx={{
                          marginRight: '2px',
                          borderRadius: '50%',
                          width: 32,
                          height: 32,
                        }}
                      />
                      &nbsp; {col.name} &nbsp;
                      {col.isVerified && <img src={verified} alt="" style={{ marginLeft: '10px' }} />}
                      {col.isExplicit && <Explicit />}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, minWidth: '100px' }}>
                      <img src={weth} alt="weth" />
                      &nbsp; {col.volume ? col.volume.toFixed(2) : '0.00'} ETH
                    </Box>
                  </TableCell>
                  <TableCell>
                    <ChangeIn24Hours change={col._24h} />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, minWidth: '100px' }}>
                      <img src={weth} alt="" />
                      &nbsp; {col.floorPrice ? col.floorPrice.toFixed(2) : '0.00'} ETH
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{col.owners}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{col.items}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {listCount < filteredCollections.length && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <Button sx={{ fontWeight: 'bold' }} size="large" variant="contained" onClick={handleAddList}>
            Load more
          </Button>
        </Box>
      )}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isFetching || isLoading || false}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
}
