import { FormatListBulleted } from '@mui/icons-material';
import { Box, Button, List, ListItem } from '@mui/material';
import ProfileMDIMG from 'assets/profile.png';
import CollectionTabItem from 'components/CollectionTabItem';
import { FilterItem } from 'components/Filter';
import { INFTCollection } from 'interfaces/INFTCollection';
import React, { useState, useEffect } from 'react';
import { useGetCollectionsQuery } from 'services/collection';

type IProps = {
  onChange?: (e: string[]) => void;
  filterOpen: boolean;
  setFilterOpen: (arg: boolean) => void;
};

export default function FilterCollection({ onChange, filterOpen, setFilterOpen }: IProps) {
  const [collections, setCollections] = useState<INFTCollection[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const { data: collectionsResponse } = useGetCollectionsQuery();
  const [filteredCollections, setFilteredCollections] = useState<INFTCollection[]>([]);
  const [listCount, setListCount] = useState(5);

  const handleClick = (id: string) => {
    let items = [...selectedCollections];
    if (items.includes(id)) {
      items = items.filter((x) => x !== id);
    } else {
      items.push(id);
    }
    setSelectedCollections(items);
    if (onChange) {
      onChange(items);
    }
  };

  const handleAddList = () => {
    const filtered = collections.slice(0, listCount + 5);
    setFilteredCollections(filtered);
    setListCount(listCount + 5);
  };

  useEffect(() => {
    if (collectionsResponse && collectionsResponse.data) {
      setCollections(collectionsResponse.data);
      setFilteredCollections(collectionsResponse.data.slice(0, listCount));
    }
  }, [collectionsResponse]);

  return (
    <>
      {filteredCollections && (
        <FilterItem
          icon={<FormatListBulleted />}
          label="Collections"
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
        >
          <List component="div" disablePadding>
            <ListItem button sx={{ display: 'flex', flexDirection: 'column' }}>
              {filteredCollections.map((collection) => (
                <Box key={collection._id} onClick={() => handleClick(collection._id)} sx={{ width: '100%' }}>
                  <CollectionTabItem
                    image={collection.logoUrl || ProfileMDIMG}
                    title={collection.name}
                    floorPrice={collection.floorPrice}
                    selected={selectedCollections.includes(collection._id)}
                  />
                </Box>
              ))}
              {listCount < collections.length && (
                <Button
                  sx={{ width: { xs: '100%', md: 'auto' }, p: 1.5, m: 2, color: 'white', borderWidth: 2 }}
                  size="medium"
                  variant="outlined"
                  onClick={handleAddList}
                >
                  Load more
                </Button>
              )}
            </ListItem>
          </List>
        </FilterItem>
      )}
    </>
  );
}
