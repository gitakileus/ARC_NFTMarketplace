import { Close } from '@mui/icons-material';
import {
  Button,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import celebrate from 'assets/celebrate.png';
import React from 'react';

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const CustomDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2, textAlign: 'center' }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

interface IEarnModalProps {
  isOpen: boolean;
  onDismiss: () => void;
}

const EarnTrading = ({ isOpen, onDismiss }: IEarnModalProps) => (
  <Dialog
    open={isOpen}
    onClose={onDismiss}
    aria-labelledby="customized-dialog-title"
    PaperProps={{ style: { background: '#1E1E1E' } }}
  >
    <CustomDialogTitle id="customized-dialog-title" onClose={onDismiss}>
      Earn Trading rewards
    </CustomDialogTitle>
    <DialogContent dividers>
      <CardMedia component="img" image={celebrate} alt="celebrate" />
      <Typography variant="h6" sx={{ textAlign: 'center', pt: 3 }} gutterBottom>
        You earn rewards when you buy or sell NFT on Depo. Rewards are distributed daily in Depo’s native tokens, DEPO.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ justifyContent: 'center', width: '100%' }}>
      <Button
        href="#"
        size="large"
        color="secondary"
        variant="contained"
        sx={{ py: 1, m: 3, fontWeight: 'bold', width: '100%', border: 0 }}
      >
        Connect wallet
      </Button>
    </DialogActions>
  </Dialog>
);

export default EarnTrading;
