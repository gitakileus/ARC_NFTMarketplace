import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Box, Select, MenuItem, CardMedia, Drawer, Grid } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import stickFilter from 'assets/stickFilter.svg';
import stickUpArrow from 'assets/stickUpArrow.svg';
import Filter from 'components/Filter';
import FilterEventType from 'components/Filter/FilterEventType';
import NFTOfferItem from 'components/NFTOfferItem';
import useWindowDimensions from 'hooks/useWindowDimension';
import { IOffer } from 'interfaces/IOffer';
import CollectionOffer from 'pages/Collections/Detail/dialog/CollectionOffer';
import React, { useState, useEffect } from 'react';

type IProps = {
  items: IOffer[];
  owner: string;
  isFetching?: boolean;
  isLoading?: boolean;
};

export default function OffersContainer({ items, owner, isFetching, isLoading }: IProps) {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [showTopBtn, setShowTopBtn] = useState(false);
  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 320) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
  }, []);
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const { width, height } = useWindowDimensions();
  const [filterOpen, setFilterOpen] = useState(true);
  const [orderStatus, setOrderStatus] = useState(0);
  const [filteredItems, setFilteredItems] = useState<IOffer[]>();
  const [collectionOfferArr, setCollectionOfferArr] = useState<IOffer[]>();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const applyEventTypeFilter = (eventTypes: string[]) => {
    if (eventTypes.length === 0) {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((x) => eventTypes.includes(x.type)));
    }
  };

  const filterOrderByStatus = (orderStatus: number) => {
    setOrderStatus(orderStatus);
    if (orderStatus === 0) {
      setFilteredItems(items.filter((item) => item.to?.toLowerCase() === owner.toLowerCase()));
    } else if (orderStatus === 1) {
      setFilteredItems(items.filter((item) => item.from?.toLowerCase() === owner.toLowerCase()));
    }
  };

  useEffect(() => {
    const itembump = items;
    let realitem;
    const collectionOffersTxt = sessionStorage.getItem('collectionOffers');
    let collectonOffersArr;
    if (collectionOffersTxt) {
      collectonOffersArr = JSON.parse(collectionOffersTxt);
      realitem = itembump.concat(collectonOffersArr);
    }
    realitem?.sort((x, y) => y.startDate - x.startDate);
    setFilteredItems(realitem);
  }, [items]);

  const renderFilter = (open: boolean, toggleOpen: any, isMobile: boolean) => {
    return (
      <Filter open={open} setOpen={toggleOpen} isMobile={isMobile}>
        <FilterEventType onChange={applyEventTypeFilter} filterOpen={filterOpen} setFilterOpen={setFilterOpen} />
      </Filter>
    );
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
      {(width || 0) < 512 ? (
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
        renderFilter(filterOpen, setFilterOpen, false)
      )}

      <Box sx={{ width: '100%' }}>
        <Select variant="filled" value={orderStatus} onChange={(e) => filterOrderByStatus(+e.target.value)}>
          <MenuItem value={0}>Received</MenuItem>
          <MenuItem value={1}>Made</MenuItem>
        </Select>
        {filteredItems?.map((item, index) => (
          <NFTOfferItem key={index} offer={item} status={orderStatus} />
        ))}
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isFetching || isLoading || false}
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
          onClick={scrollTop}
        />
      )}
    </Box>
  );
}
