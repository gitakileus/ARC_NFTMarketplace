import Axios, { AxiosInstance } from 'axios';
import ItemsContainer from 'containers/ItemsContainer';
import { INFT } from 'interfaces/INFT';
import React, { useEffect, useState } from 'react';
import { useGetItemsQuery } from 'services/item';
import { API_BASE_URL } from 'utils';

export default function ExploreItems() {
  const api: AxiosInstance = Axios.create({ baseURL: API_BASE_URL });
  const [items, setItems] = useState<INFT[]>([]);
  // const { data: itemsResponse, isFetching, isLoading } = useGetItemsQuery();
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchItems = async (dir: number) => {
    const { data: fetchedData } = await api.get(`/ws/v2/nft/items?limit=20&page=${dir}`);
    setItems(fetchedData.data);
    setIsFetching(false);
    setIsLoading(false);
  };

  // useEffect(() => {
  //   if (itemsResponse && itemsResponse.data) {
  //     setItems(itemsResponse.data);
  //   }
  // }, [itemsResponse]);

  useEffect(() => {
    fetchItems(1);
  }, []);

  return (
    <ItemsContainer
      items={items ?? []}
      isFetching={isFetching}
      isLoading={isLoading}
      fetchItems={fetchItems}
      setIsFetching={setIsFetching}
    />
  );
}
