import RewardListingContainer from 'containers/RewardListingContainer';
import { IActivity } from 'interfaces/IActivity';
import React, { useState, useEffect } from 'react';
import { useGetActivitiesQuery } from 'services/activity';
import { useGetOffersQuery } from 'services/owner';
import { useWeb3 } from 'web3';

export default function RewardListing() {
  const { account } = useWeb3();

  const { data: activitiesResponse, isFetching, isLoading } = useGetOffersQuery(account as string);
  const [items, setItems] = useState<IActivity[]>([]);

  useEffect(() => {
    if (activitiesResponse && activitiesResponse.data) {
      setItems(activitiesResponse.data);
    }
  }, [activitiesResponse]);

  return <RewardListingContainer items={items} isFetching={isFetching} isLoading={isLoading} />;
}
