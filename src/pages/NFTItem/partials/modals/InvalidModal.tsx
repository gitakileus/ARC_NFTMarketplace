import { Close } from '@mui/icons-material';
import { Button, CardMedia, IconButton, Modal, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Warning from 'assets/warning.png';
import React from 'react';

const StyledProfileModal = styled('div')(() => ({
  position: 'absolute',
  backgroundColor: '#1E1E1E',
  borderRadius: '10px',
  width: '580px',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '40px',
}));

interface IProps {
  open: boolean;
  handleClose: () => void;
}

export default function InvalidModal(props: IProps) {
  const { open, handleClose } = props;
  const tooltip =
    'Sorry, it looks like the person who made this offer doesn’t have enough ETH balance to pay for it. If they top up their balance, you may be able to accept it later';

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <StyledProfileModal>
          <IconButton onClick={handleClose} sx={{ position: 'absolute', top: '30px', right: '30px' }}>
            <Close />
          </IconButton>
          <Stack
            direction="column"
            spacing={6}
            justifyContent="center"
            alignItems="center"
            sx={{ textAlign: 'center', marginTop: '50px' }}
          >
            <CardMedia component="img" image={Warning} sx={{ height: '100px', width: '100px' }} />
            <Typography variant="h5">Invalid offer/bid</Typography>
            <Typography variant="subtitle2" sx={{ color: '#8D8D8D' }}>
              {tooltip}
            </Typography>
          </Stack>
          <Button
            variant="contained"
            color="secondary"
            sx={{ width: '100%', color: 'black', paddingY: '14px', marginTop: '40px' }}
            onClick={handleClose}
          >
            I understand
          </Button>
        </StyledProfileModal>
      </Modal>
    </>
  );
}
