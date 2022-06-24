// import { ACTIVITY_ITEMS } from 'activityItem';
import ActivityContainer from 'containers/ActivityContainer';
import { IActivity } from 'interfaces/IActivity';
import React, { useState, useEffect } from 'react';
import { useGetHistoryQuery } from 'services/owner';

type IProps = {
  address?: string;
};

export default function ProfileActivity({ address }: IProps) {
  const { data: activitiesResponse, isFetching, isLoading } = useGetHistoryQuery(address);
  const [items, setItems] = useState<IActivity[]>([]);

  useEffect(() => {
    if (activitiesResponse && activitiesResponse.data) {
      setItems(activitiesResponse.data);
    }
  }, [activitiesResponse]);

  return <ActivityContainer items={items} isFetching={isFetching} isLoading={isLoading} />;
}
