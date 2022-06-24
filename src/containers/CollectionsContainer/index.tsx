import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Box, Grid, Drawer, CardMedia } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import stickFilter from 'assets/stickFilter.svg';
import stickUpArrow from 'assets/stickUpArrow.svg';
import CollectionCard from 'components/CollectionCard';
import Filter from 'components/Filter';
import FilterEventType from 'components/Filter/FilterEventType';
import useWindowDimensions from 'hooks/useWindowDimension';
import { INFTCollection } from 'interfaces/INFTCollection';
import React, { useState, useEffect } from 'react';
import { useAppSelector } from 'state/hooks';

type IProps = {
  items: INFTCollection[];
  isFetching?: boolean;
  isLoading?: boolean;
};

export default function CollectionsContainer({ items, isFetching, isLoading }: IProps) {
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
  const [filteredItems, setFilteredItems] = useState<INFTCollection[]>(items);
  const { user } = useAppSelector((state) => state.user);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  const renderFilter = (open: boolean, toggleOpen: any, isMobile: boolean) => {
    return (
      <Filter open={open} setOpen={toggleOpen} isMobile={isMobile}>
        <FilterEventType filterOpen={filterOpen} setFilterOpen={setFilterOpen} />
      </Filter>
    );
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
      {/* {(width || 0) < 512 ? (
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
      )} */}

      <Box sx={{ width: '100%' }}>
        <Grid container spacing={3}>
          {filteredItems.map((item) => (
            <CollectionCard key={item._id} {...item} currency="ETH" user={user} />
          ))}
        </Grid>
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
