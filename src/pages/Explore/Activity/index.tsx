import Axios, { AxiosInstance } from 'axios';
import ActivityContainer from 'containers/ActivityContainer';
import { IActivity } from 'interfaces/IActivity';
import React, { useState, useEffect } from 'react';
import { useGetActivitiesQuery } from 'services/activity';
import { API_BASE_URL } from 'utils';

export default function ExploreActivity() {
  const api: AxiosInstance = Axios.create({ baseURL: API_BASE_URL });
  const { data: activitiesResponse, isFetching, isLoading } = useGetActivitiesQuery();
  const [items, setItems] = useState<IActivity[]>([]);

  // useEffect(() => {
  //   if (activitiesResponse && activitiesResponse.data) {
  //     setItems(activitiesResponse.data);
  //   }
  // }, [activitiesResponse]);

  const fetchItems = async (dir: number) => {
    const { data: fetchedData } = await api.get(
      `/ws/v2/nft/activity?limit=1000&page=${dir}&orderBy=_id&direction=DESC`
    );
    setItems(fetchedData.data);
  };

  useEffect(() => {
    fetchItems(1);
  }, []);

  return <ActivityContainer items={items} isFetching={isFetching} isLoading={isLoading} />;
}
