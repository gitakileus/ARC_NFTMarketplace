import ContactUs from './ContactUs';
import { Box, Container } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Footer() {
  const [currentURL, setCurrentURL] = useState('');
  const location = useLocation();
  useEffect(() => {
    setCurrentURL(window.location.href);
  }, [location]);
  return (
    <>
      {location.pathname !== '/explore' && (
        <Box sx={{ py: { md: 18, xs: 5 }, backgroundColor: '#1A1919', position: 'relative' }}>
          <Container>
            <ContactUs />
          </Container>
        </Box>
      )}
    </>
  );
}
