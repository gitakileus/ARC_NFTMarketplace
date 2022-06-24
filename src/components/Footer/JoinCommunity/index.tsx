import { Box, Button, Grid, CardMedia, Container, styled, Typography } from '@mui/material';
import discordImg from 'assets/discord.png';
import discordCut from 'assets/discordCut.png';
import useWindowDimensions from 'hooks/useWindowDimension';
import React from 'react';

export default function JoinCommunity() {
  const { width, height } = useWindowDimensions();
  return (
    <Grid
      container
      spacing={5}
      alignItems="center"
      paddingX={3}
      paddingBottom={10}
      sx={{ textAlign: '-webkit-center' }}
    >
      <Grid item xs={12} sm={6}>
        {(width || 0) < 512 ? (
          <CardMedia component="img" image={discordImg} sx={{ width: '90%', mb: { xs: 2, md: 0 } }} />
        ) : (
          <CardMedia component="img" image={discordCut} sx={{ width: '80%', mb: { xs: 2, md: 0 } }} />
        )}
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="h4" mb={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          Join our community
        </Typography>
        <Typography
          variant="subtitle2"
          color="textSecondary"
          mb={4}
          maxWidth="450px"
          sx={{ textAlign: { xs: 'center', md: 'left' } }}
        >
          Visit our discord channel to meet the growing community of Arc investors & users, and hear all the latest
          updates.
        </Typography>
        <Button
          sx={{ width: { xs: '100%', md: 'auto' } }}
          size="large"
          variant="contained"
          href="https://discord.com/invite/arcdefi"
          target="_blank"
        >
          Join discord
        </Button>
      </Grid>
    </Grid>
  );
}
