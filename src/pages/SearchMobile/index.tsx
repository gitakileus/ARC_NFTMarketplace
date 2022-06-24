import { __debounce } from '../../utils/debounce';
import { Search } from '@mui/icons-material';
import { Box, CardMedia, DialogContent, Grid, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import theme from 'config/theme';
import { INFT } from 'interfaces/INFT';
import { INFTCollection } from 'interfaces/INFTCollection';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetSearchQuery } from 'services/search';

const SearchModal = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [collectionShow, setCollectionShow] = useState(4);
  const [itemShow, setItemShow] = useState(4);
  const [collections, setCollections] = useState<INFTCollection[]>([]);
  const [items, setItems] = useState<INFT[]>([]);
  const filteredCollections = collections.filter((item, index) => index < collectionShow);
  const filteredItems = items.filter((item, index) => index < itemShow);
  const searchResponse = useGetSearchQuery(searchTerm);
  const changeHandler = (event: any) => {
    __debounce(
      () => {
        const q = event.target.value.replace(/\W/gim, '');
        setSearchTerm(q);
      },
      250,
      'set-search-str'
    );
  };

  const handleCollectionClick = (collection: INFTCollection) => {
    if (_.isEmpty(collection.url)) navigate(`/collections/id/${collection._id}`);
    else navigate(`/collections/${collection.url}`);
  };

  useEffect(() => {
    if (searchResponse.data && searchResponse.data.success) {
      setCollections(searchResponse.data.data.collections);
      setItems(searchResponse.data.data.items);
    }
  }, [searchResponse]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            id="search"
            autoComplete="given-name"
            name="search"
            required
            fullWidth
            autoFocus
            onChange={changeHandler}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 3,
              },
            }}
          />
          <Typography onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
            Cancel
          </Typography>
        </Stack>
      </>
      <DialogContent>
        {!!collections.length && (
          <Stack spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Collections
            </Typography>
            <Grid container>
              {filteredCollections.map((item, index) => (
                <Grid
                  item
                  sm={6}
                  key={index}
                  sx={{ my: 1.5, cursor: 'pointer' }}
                  onClick={() => handleCollectionClick(item)}
                >
                  <Stack direction="row" alignItems="center">
                    <CardMedia
                      component="img"
                      image={item.logoUrl}
                      alt="icon"
                      sx={{ width: '40px', height: '40px', borderRadius: '50%' }}
                    />
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;{item.name}
                  </Stack>
                </Grid>
              ))}
            </Grid>
            {!!(collections.length > collectionShow) && (
              <Typography
                variant="subtitle2"
                color="#007AFF"
                fontWeight={600}
                textAlign="center"
                sx={{ cursor: 'pointer' }}
                onClick={() => setCollectionShow(collectionShow + 2)}
              >
                More
              </Typography>
            )}
          </Stack>
        )}
        {!!items.length && (
          <Stack spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Items
            </Typography>
            <Grid container>
              {filteredItems.map((item, index) => (
                <Grid
                  item
                  sm={6}
                  key={index}
                  sx={{ my: 1.5, cursor: 'pointer', mr: 3 }}
                  onClick={() => {
                    window.location.href = `/items/${item.collection}/${item.index}`;
                  }}
                >
                  <Stack direction="row" alignItems="center">
                    <CardMedia
                      component="img"
                      image={item.artURI}
                      alt="icon"
                      sx={{ width: '35px', height: '35px', borderRadius: '50%' }}
                    />
                    <Stack sx={{ ml: 1 }}>
                      <Typography>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;{item.name}</Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        {item.collection_details?.name}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>
              ))}
            </Grid>
            {!!(items.length > itemShow) && (
              <Typography
                variant="subtitle2"
                color="#007AFF"
                fontWeight={600}
                textAlign="center"
                sx={{ cursor: 'pointer' }}
                onClick={() => setItemShow(itemShow + 2)}
              >
                More
              </Typography>
            )}
          </Stack>
        )}
      </DialogContent>
    </Box>
  );
};

export default SearchModal;
