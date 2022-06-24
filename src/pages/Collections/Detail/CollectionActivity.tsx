// import { ACTIVITY_ITEMS } from 'activityItem';
import ActivityContainer from 'containers/ActivityContainer';
import { IActivity } from 'interfaces/IActivity';
import React, { useState, useEffect } from 'react';
import { useGetActivityQuery } from 'services/collection';

interface IProps {
  collectionID: string;
}

export default function CollectionActivity(props: IProps) {
  const { data: activitiesResponse } = useGetActivityQuery(props.collectionID);
  const [items, setItems] = useState<IActivity[]>([]);
  useEffect(() => {
    if (activitiesResponse && activitiesResponse.data) {
      setItems(activitiesResponse.data);
    }
  }, [activitiesResponse]);

  return <ActivityContainer items={items} />;
}
