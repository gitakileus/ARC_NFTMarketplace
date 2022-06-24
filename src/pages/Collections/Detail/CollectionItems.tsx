import ItemsContainer from 'containers/ItemsContainer';
import { INFT } from 'interfaces/INFT';
import { INFTCollection } from 'interfaces/INFTCollection';
// import { NFT_ITEMS } from 'nftItem';
import { useEffect, useState } from 'react';
import { useGetItemsQuery } from 'services/collection';

interface IProps {
  collectionID: string;
  collectionDetails: INFTCollection;
}

export default function CollectionItems(props: IProps) {
  const { data: collectionResponse } = useGetItemsQuery(props.collectionID);
  const [collection, setCollection] = useState<INFTCollection>();
  const [collectionStatic, setCollectionStatic] = useState<INFT[]>([]);

  useEffect(() => {
    setCollection(props.collectionDetails);
  }, [props.collectionDetails]);

  return <ItemsContainer items={collection?.nfts ?? []} collectionDetails={collection} />;
}
