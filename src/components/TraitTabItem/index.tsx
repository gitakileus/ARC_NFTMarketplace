import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';

interface IProps {
  trait: string;
  setFilterProperties: (arg: string) => void;
  selected: any;
}

export default function TraitTabItem({ trait, selected, setFilterProperties }: IProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        p: 1,
        mb: 2,
        width: '100%',
        border: 1,
        borderColor: selected[trait] ? '#007AFF' : 'grey.800',
        borderRadius: '10px',
        ':hover': { borderColor: '#007AFF' },
      }}
      onClick={() => setFilterProperties(trait)}
    >
      <Typography variant="caption" color="text.white">
        {trait}
      </Typography>
    </Box>
  );
}
