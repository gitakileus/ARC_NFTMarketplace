import { Box, Button, Container, Typography } from '@mui/material';
import React from 'react';

const ImportList = () => (
  <Box sx={{ background: '#CAD7FF', py: 4 }}>
    <Container sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box>
        <Typography variant="h6" color="#000" fontWeight={800}>
          List your NFTs for free. We&apos;ll cover the cost.
        </Typography>
        <Typography variant="subtitle2" color="#000">
          We’re refunding up to 10 collection approvals per wallet this week. Import from Opensea or list now!
        </Typography>
      </Box>
      <Button
        sx={{ width: { xs: '100%', md: 'auto' }, fontWeight: 'bold' }}
        size="large"
        color="secondary"
        variant="contained"
        href="/profile/import"
      >
        Import listings
      </Button>
    </Container>
  </Box>
);
export default ImportList;
