import CollectionsContainer from 'containers/CollectionsContainer';
import { INFTCollection } from 'interfaces/INFTCollection';
// import { INFT_COLLECTION } from 'nftCollection';
import React, { useEffect, useState } from 'react';
import { useGetCollectionsQuery } from 'services/owner';

type IProps = {
  address?: string;
};

export default function ProfileCollections({ address }: IProps) {
  const [collections, setCollections] = useState<INFTCollection[]>([]);

  const { data: collectionsResponse, isFetching, isLoading } = useGetCollectionsQuery(address);

  useEffect(() => {
    if (collectionsResponse && collectionsResponse.data) {
      setCollections(collectionsResponse.data);
    }
  }, [collectionsResponse]);

  return <CollectionsContainer items={collections ?? []} isFetching={isFetching} isLoading={isLoading} />;
}
