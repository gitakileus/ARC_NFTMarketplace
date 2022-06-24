import useMediaQuery from '@material-ui/core/useMediaQuery';
import { CardTravel, FormatListBulleted, Sell } from '@mui/icons-material';
import {
  Box,
  Card,
  CardMedia,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Switch,
  Stack,
  Typography,
} from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Ether from 'assets/Icon/ether.svg';
import stickFilter from 'assets/stickFilter.svg';
import stickUpArrow from 'assets/stickUpArrow.svg';
import Filter, { FilterItem } from 'components/Filter';
import FilterCollection from 'components/Filter/FilterCollection';
import NFTCardItem from 'components/NFTCardItem';
import RoundedTextField from 'components/RoundedTextField';
import TraitTabItem from 'components/TraitTabItem';
import { INFT } from 'interfaces/INFT';
import { INFTCollection } from 'interfaces/INFTCollection';
import _ from 'lodash';
import React, { useEffect, useState, UIEvent, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface IProperty {
  title: string;
  name: string;
}

type IProps = {
  items: INFT[];
  collectionDetails?: INFTCollection;
  isFetching?: boolean;
  isLoading?: boolean;
  fetchItems?: (dir: number) => void;
  setIsFetching?: (is: boolean) => void;
  address?: string;
};
let itemjoined: INFT[] = [];

export default function ItemsContainer({
  items,
  collectionDetails,
  isFetching,
  isLoading,
  fetchItems,
  setIsFetching,
  address,
}: IProps) {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const location = useLocation();
  const [filterOpen, setFilterOpen] = useState(true);
  const [sortBy, setSortBy] = useState('price_ascending');
  const [filterProperties, setFilterProperties] = useState<any>({});
  const [filterCollections, setFilterCollections] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('0');
  const [maxPrice, setMaxPrice] = useState('0');
  const [isBuyable, handleBuyable] = useState(false);
  const [filteredItems, setFilteredItems] = useState<INFT[]>([]);
  const [displayItems, setDisplayItems] = useState<INFT[]>([]);
  const [dir, setDir] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const isCollectionPage = collectionDetails ? true : false;
  const isMobile = useMediaQuery('(max-width:768px)');

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (collectionDetails) {
      const initial: any = {};
      Object.keys(collectionDetails.properties).forEach((item) => {
        initial[item] = {};
      });
      setFilterProperties(initial);
    }
  }, [collectionDetails]);

  useEffect(() => {
    itemjoined = [];
  }, [location, address]);

  const handleFilterProperties = (property: string, attribute: string) => {
    setFilterProperties({
      ...filterProperties,
      [property]: {
        ...filterProperties[property],
        [attribute]: filterProperties[property][attribute] ? false : true,
      },
    });
  };

  const handleScrollEvent = (e: UIEvent<HTMLDivElement>) => {
    const obj = e.currentTarget;
    if (obj.scrollTop > 10) {
      setShowTopBtn(true);
    } else {
      setShowTopBtn(false);
    }
    if (fetchItems && !isCompleted) {
      if (obj.scrollHeight - obj.clientHeight - obj.scrollTop < 400) {
        if (setIsFetching) setIsFetching(true);
        fetchItems(dir + 1);
        setDir(dir + 1);
      }
    }
  };

  const handleTop = (e: any) => {
    if (ref.current !== null) ref.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const compareName = (a: INFT, b: INFT) => {
    if (a.collection_details?.name && b.collection_details?.name) {
      if (a.collection_details.name.toLowerCase() > b.collection_details.name.toLowerCase()) return 1;
      if (a.collection_details.name.toLowerCase() < b.collection_details.name.toLowerCase()) return -1;
      return 0;
    }
    return 0;
  };

  const comparePriceAscending = (x: INFT, y: INFT) => {
    if (x.price === 0 || x.saleStatus === 'Not For Sale') {
      return 1;
    }
    if (y.price === 0 || y.saleStatus === 'Not For Sale') {
      return -1;
    }
    return x.price - y.price;
  };

  const comparePriceDescending = (x: INFT, y: INFT) => {
    if (x.saleStatus === 'Not For Sale') {
      return 1;
    }
    if (y.saleStatus === 'Not For Sale') {
      return -1;
    }
    return y.price - x.price;
  };

  const filterPriceMoreThan = (x: INFT) => {
    return x.saleStatus === 'For Sale' && x.price >= +minPrice;
  };

  const filterPriceLessThan = (x: INFT) => {
    return x.saleStatus === 'For Sale' && x.price <= +maxPrice;
  };

  useEffect(() => {
    setFilteredItems([]);
    const buyNow = 'For Sale';
    if (items.length > 0 && items.length < 10) setIsCompleted(true);
    itemjoined = itemjoined.concat(items);
    const ids = itemjoined.map((o) => o._id);
    let filtered = itemjoined.filter(({ _id }, index) => !ids.includes(_id, index + 1));
    if (+minPrice) {
      filtered = filtered.filter(filterPriceMoreThan);
    }
    if (+maxPrice) {
      filtered = filtered.filter(filterPriceLessThan);
    }
    if (filterCollections.length > 0) {
      filtered = filtered.filter((x) => filterCollections.includes(x.collection));
    }
    if (isBuyable) {
      filtered = filtered.filter((x) => buyNow.includes(x.saleStatus ?? ''));
    }
    if (sortBy === 'price_descending') {
      filtered.sort(comparePriceDescending);
    } else if (sortBy === 'recent_activity') {
      filtered.sort((x, y) => Number(y.status_date) - Number(x.status_date));
    } else if (sortBy === 'price_ascending') {
      filtered.sort(comparePriceAscending);
    }
    if (filtered.length < 20 && fetchItems) {
      fetchItems(dir + 1);
      setDir(dir + 1);
    }
    setFilteredItems(filtered);
  }, [items, sortBy, filterCollections, minPrice, maxPrice, isBuyable]);

  useEffect(() => {
    setDisplayItems([]);
    let NFTs = [...filteredItems];
    Object.keys(filterProperties).map((item, index) => {
      const filteredProperty = filterProperties[item];
      let result: any = [];
      let allSelected = true;
      Object.keys(filteredProperty).map((attribute) => {
        if (filteredProperty[attribute]) {
          allSelected = false;
          const filteredNFT = NFTs.filter((NFT) => {
            const NFTProperty = NFT.properties.filter((i: IProperty) => i.title === item && i.name === attribute);
            if (_.isEmpty(NFTProperty)) return false;
            return true;
          });
          if (!_.isEmpty(filteredNFT)) filteredNFT.map((item) => (result = [...result, item]));
        }
        return true;
      });
      if (allSelected) {
        setDisplayItems([...NFTs]);
      } else {
        setDisplayItems([...result]);
        NFTs = [...result];
      }

      return true;
    });
  }, [filteredItems, filterProperties]);

  const renderFilter = (open: boolean, toggleOpen: any, isMobile: boolean) => {
    return (
      <Filter open={open} setOpen={toggleOpen} isMobile={isMobile}>
        <FilterItem icon={<CardTravel />} label="Sort by" filterOpen={filterOpen} setFilterOpen={setFilterOpen}>
          <List component="div" disablePadding>
            <ListItem button>
              <FormControl sx={{ width: '100%', fontSize: 14 }}>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <FormControlLabel
                    value="recent_activity"
                    labelPlacement="start"
                    control={<Radio />}
                    label={<Typography sx={{ fontSize: 14 }}>Recent activity</Typography>}
                    sx={{ justifyContent: 'space-between', marginLeft: 0 }}
                  />
                  <FormControlLabel
                    value="price_ascending"
                    labelPlacement="start"
                    control={<Radio />}
                    label={<Typography sx={{ fontSize: 14 }}>Price ascending</Typography>}
                    sx={{ justifyContent: 'space-between', marginLeft: 0 }}
                  />
                  <FormControlLabel
                    value="price_descending"
                    labelPlacement="start"
                    control={<Radio />}
                    label={<Typography sx={{ fontSize: 14 }}>Price descending</Typography>}
                    sx={{ justifyContent: 'space-between', marginLeft: 0 }}
                  />
                </RadioGroup>
              </FormControl>
            </ListItem>
          </List>
        </FilterItem>
        <FilterItem icon={<CardTravel />} label="Items status" filterOpen={filterOpen} setFilterOpen={setFilterOpen}>
          <List component="div" disablePadding>
            <ListItem button>
              <FormGroup sx={{ width: '100%' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isBuyable}
                      onChange={() => handleBuyable(!isBuyable)}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  }
                  label={<Typography sx={{ fontSize: 14 }}>Buy now</Typography>}
                  labelPlacement="start"
                  sx={{ justifyContent: 'space-between', marginLeft: 0 }}
                />
              </FormGroup>
            </ListItem>
          </List>
        </FilterItem>
        <FilterItem icon={<Sell />} label="Price range" filterOpen={filterOpen} setFilterOpen={setFilterOpen}>
          <List component="div" disablePadding>
            <ListItem button sx={{ display: 'flex', alignItems: 'end', justifyContent: 'right' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" color="text.secondary" mb={1}>
                  Lowest
                </Typography>
                <RoundedTextField
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2 }}>
                <Typography variant="caption" color="text.secondary" mb={1}>
                  Highest
                </Typography>
                <RoundedTextField
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </Box>
              <img src={Ether} alt="ether" style={{ width: 17, paddingBottom: 8, marginLeft: 16 }} />
            </ListItem>
          </List>
        </FilterItem>

        {collectionDetails ? (
          Object.keys(collectionDetails.properties).map((property, i) => (
            <FilterItem
              key={i}
              icon={<FormatListBulleted />}
              label={property}
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
            >
              <List component="div" disablePadding>
                <ListItem button sx={{ display: 'flex', flexDirection: 'column' }}>
                  {collectionDetails.properties[property].map((attribute: any, indexAttribute: number) => (
                    <TraitTabItem
                      key={indexAttribute}
                      trait={attribute}
                      selected={filterProperties[property]}
                      setFilterProperties={(selectedAttribute) => handleFilterProperties(property, selectedAttribute)}
                    />
                  ))}
                </ListItem>
              </List>
            </FilterItem>
          ))
        ) : (
          <FilterCollection
            onChange={(collections) => setFilterCollections(collections)}
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
          />
        )}
      </Filter>
    );
  };

  return (
    <>
      <Stack direction="row" sx={{ maxHeight: 'calc(100vh - 250px)' }}>
        {isMobile ? (
          <div>
            <CardMedia
              component="img"
              image={stickFilter}
              alt="filter"
              sx={{ position: 'fixed', zIndex: 1000, width: '40px', height: '40px', right: 20, bottom: 20 }}
              onClick={toggleDrawer}
            />
            <Drawer anchor="bottom" open={drawerOpen} onClose={toggleDrawer}>
              {renderFilter(filterOpen, toggleDrawer, true)}
            </Drawer>
          </div>
        ) : (
          <div>{renderFilter(filterOpen, setFilterOpen, false)}</div>
        )}
        <div
          onScroll={handleScrollEvent}
          style={{
            overflowY: 'scroll',
            zIndex: 1,
          }}
          ref={ref}
        >
          <Grid container spacing={2}>
            {_.isEmpty(filterProperties)
              ? filteredItems.map((item, index) => (
                  <NFTCardItem
                    key={index}
                    nft={item}
                    collection_details={item.collection_details}
                    collectionObj={collectionDetails}
                    isCollectionPage={isCollectionPage}
                  />
                ))
              : displayItems.map((item, index) => (
                  <NFTCardItem
                    key={index}
                    nft={item}
                    collection_details={item.collection_details}
                    collectionObj={collectionDetails}
                    isCollectionPage={isCollectionPage}
                  />
                ))}
          </Grid>
        </div>
      </Stack>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={dir === 1 && (isFetching || isLoading || false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {!isMobile && showTopBtn && (
        <CardMedia
          component="img"
          image={stickUpArrow}
          alt="filter"
          sx={{
            position: 'fixed',
            zIndex: 1000,
            width: '40px',
            height: '40px',
            right: 20,
            bottom: 20,
            cursor: 'pointer',
          }}
          onClick={handleTop}
        />
      )}
    </>
  );
}
