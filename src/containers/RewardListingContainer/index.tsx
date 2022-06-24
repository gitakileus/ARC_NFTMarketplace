import { Grid, CardMedia, Drawer } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import stickFilter from 'assets/stickFilter.svg';
import Filter from 'components/Filter';
import FilterEventType from 'components/Filter/FilterEventType';
import RewardNFTItem from 'components/RewardNFTItem';
import useWindowDimensions from 'hooks/useWindowDimension';
import { IActivity } from 'interfaces/IActivity';
import React, { useState, useEffect } from 'react';

type IProps = {
  items: IActivity[];
  isFetching?: boolean;
  isLoading?: boolean;
};

export default function RewardListingContainer({ items, isFetching, isLoading }: IProps) {
  const { width, height } = useWindowDimensions();
  const [filterOpen, setFilterOpen] = useState(true);
  const [filteredItems, setFilteredItems] = useState<IActivity[]>(items);
  const [sortedItems, setSortedItems] = useState<IActivity[]>(items);
  const [listedOffers, setlistedOffers] = useState<IActivity[]>(items);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const [totalRewards, setTotalRewards] = useState(0);

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
    setlistedOffers(sortedItems.filter((x) => x.type === 'List' && x.collection));
  }, [sortedItems]);

  const renderFilter = (open: boolean, toggleOpen: any, isMobile: boolean) => {
    return (
      <Filter open={open} setOpen={toggleOpen} isMobile={isMobile}>
        <FilterEventType onChange={applyEventTypeFilter} filterOpen={filterOpen} setFilterOpen={setFilterOpen} />
      </Filter>
    );
  };

  return (
    <>
      <div
        style={{
          width: '100%',
          padding: '16px',
          background: 'linear-gradient(90deg, #a1c4fd 56.04%, #c2e9fb 100%)',
          borderRadius: '10px',
          marginBottom: '24px',
          fontWeight: '500',
          fontSize: '12px',
          color: '#141313',
        }}
      >
        Total rewards for {listedOffers.length} NFTs Listed:{' '}
        <span style={{ fontWeight: 'bold' }}> {totalRewards} ARC</span> ($2000.00)
      </div>
      <Grid container justifyContent="center">
        {listedOffers.map((item, index) => (
          <RewardNFTItem key={index} activity={item} />
        ))}
      </Grid>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isFetching || isLoading || false}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
