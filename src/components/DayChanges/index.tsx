import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlined from '@mui/icons-material/KeyboardArrowUpOutlined';
import { Box, Typography } from '@mui/material';
import React from 'react';

const DayChanges: React.FC<{ change: number }> = ({ change }) => {
  const isUp = change >= 0;
  const styles = {
    backgroundColor: isUp ? '#1dd736' : '#f12d28',
    borderRadius: 1,
    color: '#fff',
    width: '15px',
    height: 'auto',
  };
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {isUp ? <KeyboardArrowUpOutlined sx={styles} /> : <KeyboardArrowDownOutlinedIcon sx={styles} />}
      <Typography sx={{ ml: 1, fontSize: '14px' }} color={isUp ? '#1dd736' : '#f12d28'}>
        {change.toFixed(2)} %
      </Typography>
    </Box>
  );
};

export default DayChanges;
