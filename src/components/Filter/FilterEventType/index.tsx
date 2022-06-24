import { Sell } from '@mui/icons-material';
import { Box, Grid, List, ListItem, Typography } from '@mui/material';
import { FilterItem } from 'components/Filter';
import { EVENT_TYPES } from 'config/eventType';
import React, { useState } from 'react';

type IProps = {
  onChange?: (e: string[]) => void;
  filterOpen?: boolean;
  setFilterOpen?: (arg: boolean) => void;
};

export default function FilterEventType({ onChange, filterOpen, setFilterOpen }: IProps) {
  const [eventTypes, setEventTypes] = useState<string[]>([]);

  const handleClick = (eventType: string) => {
    let items = [...eventTypes];
    if (items.includes(eventType)) {
      items = items.filter((x) => x !== eventType);
    } else {
      items.push(eventType);
    }
    setEventTypes(items);
    if (onChange) {
      onChange(items);
    }
  };

  return (
    <FilterItem icon={<Sell />} label="Event type" filterOpen={filterOpen} setFilterOpen={setFilterOpen}>
      <List component="div" disablePadding>
        <ListItem button sx={{ justifyContent: 'right' }}>
          <Grid container spacing={2}>
            {EVENT_TYPES.map((eventType) => (
              <Grid item xs={12} sm={eventType === 'Canceled offers' ? 12 : 6} key={eventType}>
                <Box
                  sx={{
                    width: '100%',
                    py: 1,
                    border: 1,
                    borderColor: eventTypes.includes(eventType) ? '#007AFF' : 'grey.800',
                    borderRadius: '6px',
                    textAlign: 'center',
                  }}
                  onClick={() => handleClick(eventType)}
                >
                  <Typography variant="caption">{eventType}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </ListItem>
      </List>
    </FilterItem>
  );
}
