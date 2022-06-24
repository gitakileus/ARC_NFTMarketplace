import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import CollectionUpdate from 'components/CollectionCreate';
import { INFTCollection } from 'interfaces/INFTCollection';
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetCollectionQuery, useGetCollectionByURLQuery } from 'services/collection';

const EditCollection = () => {
  const { id: _id, url }: any = useParams();
  const [collection, setCollection] = useState<INFTCollection>();
  const { data: CollectionResponse } = useGetCollectionQuery(_id);
  const { data: CollectionByURLResponse } = useGetCollectionByURLQuery(url);

  const [isLoadingFetchingCollection, setIsLoading] = useState(true);

  useEffect(() => {
    if (_.isEmpty(url)) {
      if (CollectionResponse && CollectionResponse.success === true) {
        setCollection(CollectionResponse.data);
        setIsLoading(false);
      }
    } else {
      if (CollectionByURLResponse && CollectionByURLResponse.success === true) {
        setCollection(CollectionByURLResponse.data);
        setIsLoading(false);
      }
    }
  }, [_id, url, CollectionResponse, CollectionByURLResponse]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      {collection && <CollectionUpdate collection={collection} />}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoadingFetchingCollection}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default EditCollection;
