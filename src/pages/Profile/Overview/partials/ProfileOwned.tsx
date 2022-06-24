import ItemsContainer from 'containers/ItemsContainer';
import { INFT } from 'interfaces/INFT';
import React, { useEffect, useState } from 'react';
import { useGetNftsQuery } from 'services/owner';

type IProps = {
  address?: string;
};

export default function ProfileOwned({ address }: IProps) {
  const [items, setItems] = useState<INFT[]>([]);
  const { data: itemsResponse, isFetching, isLoading } = useGetNftsQuery(address);

  useEffect(() => {
    setItems([]);
    if (itemsResponse && itemsResponse.data) {
      setItems(itemsResponse.data);
    }
  }, [itemsResponse, address]);

  return <ItemsContainer items={items ?? []} isFetching={isFetching} isLoading={isLoading} address={address} />;
}
