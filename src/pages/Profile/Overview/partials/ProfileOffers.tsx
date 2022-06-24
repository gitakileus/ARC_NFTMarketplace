import OffersContainer from 'containers/OffersContainer';
import { IOffer } from 'interfaces/IOffer';
// import { OFFER_ITEMS } from 'offerItem';
import React, { useEffect, useState } from 'react';
import { useGetOffersQuery } from 'services/owner';

type IProps = {
  address: string;
};

export default function ProfileOffers({ address }: IProps) {
  const { data: offersResponse, isFetching, isLoading } = useGetOffersQuery(address);
  const [items, setItems] = useState<IOffer[]>([]);
  useEffect(() => {
    if (offersResponse && offersResponse.data) {
      setItems(offersResponse.data);
    }
  }, [offersResponse]);

  return <OffersContainer items={items} owner={address} isFetching={isFetching} isLoading={isLoading} />;
}
