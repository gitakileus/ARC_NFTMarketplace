import { Close } from '@mui/icons-material';
import { Button, CardMedia, IconButton, Modal, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import DoneCheck from 'assets/Icon/doneCheck.svg';
import Loading from 'assets/Icon/loading.svg';
import React, { useState } from 'react';

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
  handleClose: (arg: boolean) => void;
}

export default function CollectionModal(props: IProps) {
  const { open, handleClose } = props;
  const [curState] = useState(2);

  return (
    <>
      <Modal open={open} onClose={() => handleClose(false)}>
        <StyledProfileModal>
          <IconButton onClick={() => handleClose(false)} sx={{ position: 'absolute', top: '30px', right: '30px' }}>
            <Close />
          </IconButton>
          <Typography variant="subtitle1" sx={{ paddingBottom: '24px' }}>
            Collection offer
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <CardMedia
              component="img"
              image={curState === 1 ? Loading : DoneCheck}
              sx={{ width: '20px', height: '20px' }}
            />
            <Stack spacing={2}>
              <Typography variant="subtitle1">Sign in Wallet</Typography>
              <Typography variant="subtitle2" sx={{ color: '#8D8D8D' }}>
                Confirm the transaction in your wallet. This lets you sell any item in this collection
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <CardMedia
              component="img"
              image={curState === 1 ? Loading : DoneCheck}
              sx={{ width: '20px', height: '20px' }}
            />
            <Typography variant="subtitle1">Complete Listing</Typography>
          </Stack>
          {curState === 1 && (
            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              <Button variant="outlined" sx={{ width: '100%', paddingY: '8px' }}>
                Edit listing
              </Button>
              <Button variant="text" sx={{ width: '100%', paddingY: '8px' }}>
                Cancel listing
              </Button>
            </Stack>
          )}
          {curState === 2 && (
            <Button variant="contained" color="secondary" sx={{ width: '100%', paddingY: '8px', mt: 4 }}>
              Back to profile
            </Button>
          )}
        </StyledProfileModal>
      </Modal>
    </>
  );
}
