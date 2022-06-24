import { __debounce } from '../../utils/debounce';
import { Search } from '@mui/icons-material';
import {
  CardMedia,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import theme from 'config/theme';
import { INFT } from 'interfaces/INFT';
import { INFTCollection } from 'interfaces/INFTCollection';
import _, { isUndefined } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetSearchQuery } from 'services/search';
import { shortenString } from 'utils';

interface ISearchModal {
  isOpen: boolean;
  onDismiss: () => void;
}

const SearchModal = ({ isOpen, onDismiss }: ISearchModal) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(true);
  const [collectionShow, setCollectionShow] = useState(4);
  const [itemShow, setItemShow] = useState(4);
  const [collections, setCollections] = useState<INFTCollection[]>([]);
  const [items, setItems] = useState<INFT[]>([]);
  const filteredCollections = collections.filter((item, index) => index < collectionShow);
  const filteredItems = items.filter((item, index) => index < itemShow);
  const searchResponse = useGetSearchQuery(searchTerm);

  const handleKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      setIsSearching(true);
      __debounce(
        () => {
          const q = event.target.value;
          setSearchTerm(q);
        },
        250,
        'set-search-str'
      );
    }
  };

  const handleCollectionClick = (collection: INFTCollection) => {
    if (_.isEmpty(collection.url)) navigate(`/collections/id/${collection._id}`);
    else navigate(`/collections/${collection.url}`);
    onDismiss();
  };

  const handleItemClick = (item: INFT) => {
    navigate(`/items/${item.collection}/${item.index}`);
    onDismiss();
  };

  useEffect(() => {
    if (searchResponse.data && searchResponse.data.success) {
      setCollections(searchResponse.data.data.collections);
      setItems(searchResponse.data.data.items);
    }
    setIsSearching(false);
  }, [searchResponse]);

  return (
    <Dialog
      open={isOpen}
      onClose={onDismiss}
      aria-labelledby="customized-dialog-title"
      PaperProps={{
        style: { background: theme.palette.secondary.main, width: '500px', borderRadius: 10, padding: 10 },
      }}
    >
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            id="search"
            autoComplete="given-name"
            name="search"
            required
            fullWidth
            autoFocus
            onKeyDown={handleKeyDown}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                  {isSearching && <CircularProgress color="inherit" sx={{ position: 'absolute', left: 4 }} />}
                </InputAdornment>
              ),
              sx: {
                borderRadius: 3,
              },
            }}
          />
          <Typography onClick={onDismiss} sx={{ cursor: 'pointer' }}>
            Cancel
          </Typography>
        </Stack>
        <Typography sx={{ mt: 2 }}>Press ENTER to search</Typography>
      </DialogTitle>
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
                      sx={{ width: '40px', height: '40px', mr: 1, borderRadius: '50%' }}
                    />
                    {shortenString(item.name)}
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
                <Grid item sm={6} key={index} sx={{ my: 1.5, cursor: 'pointer' }} onClick={() => handleItemClick(item)}>
                  <Stack direction="row" alignItems="center">
                    <CardMedia
                      component="img"
                      image={item.artURI}
                      alt="icon"
                      sx={{ width: '35px', height: '35px', mr: 1, borderRadius: '50%' }}
                    />
                    {shortenString(item.name)}
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.collection_details?.name !== undefined ? shortenString(item.collection_details.name) : ''}
                    </Typography>
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
    </Dialog>
  );
};

export default SearchModal;
