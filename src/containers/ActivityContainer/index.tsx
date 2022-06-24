import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Box, Grid, CardMedia, Drawer } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import stickFilter from 'assets/stickFilter.svg';
import stickUpArrow from 'assets/stickUpArrow.svg';
import Filter from 'components/Filter';
import FilterEventType from 'components/Filter/FilterEventType';
import NFTActivityItem from 'components/NFTActivityItem';
import useWindowDimensions from 'hooks/useWindowDimension';
import { IActivity } from 'interfaces/IActivity';
import React, { useState, useEffect } from 'react';

type IProps = {
  items: IActivity[];
  isFetching?: boolean;
  isLoading?: boolean;
};

export default function ActivityContainer({ items, isFetching, isLoading }: IProps) {
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
  const [filteredItems, setFilteredItems] = useState<IActivity[]>(items);
  const [sortedItems, setSortedItems] = useState<IActivity[]>(items);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const applyEventTypeFilter = (eventTypes: string[]) => {
    if (eventTypes.length === 0) {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((x) => eventTypes.includes(x.type)));
    }
  };

  useEffect(() => {
    if (items.length !== 0) {
      setSortedItems(
        [...items].sort((a, b) => (b.startDate ? b.startDate : b.date) - (a.startDate ? a.startDate : a.date))
      );
      const collectionOffers = items.filter((x) => x.type === 'OfferCollection');
      sessionStorage.setItem('collectionOffers', JSON.stringify(collectionOffers));
    }
  }, [items]);

  useEffect(() => {
    setFilteredItems(sortedItems);
  }, [sortedItems]);

  const renderFilter = (open: boolean, toggleOpen: any, isMobile: boolean) => {
    return (
      <Filter open={open} setOpen={toggleOpen} isMobile={isMobile}>
        <FilterEventType onChange={applyEventTypeFilter} filterOpen={filterOpen} setFilterOpen={setFilterOpen} />
      </Filter>
    );
  };

  return (
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Grid container justifyContent="center">
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
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2.5} sx={{ mb: 5 }}>
            {renderFilter(filterOpen, setFilterOpen, false)}
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={8} lg={9} xl={9.5}>
          {filteredItems.map((item, index) => (
            // <>{item.nft?.name && <NFTActivityItem key={index} activity={item} />}</>
            <NFTActivityItem key={index} activity={item} />
          ))}
        </Grid>
      </Grid>
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
