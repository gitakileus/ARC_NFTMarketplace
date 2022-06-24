import { Close } from '@mui/icons-material';
import {
  Button,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import bunch from 'assets/Icon/bunch.svg';
import { INFTCollection } from 'interfaces/INFTCollection';
import _ from 'lodash';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const CustomDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 3 }} {...other}>
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

interface IConfirmModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  collection: INFTCollection;
  offerPrice: number;
  offerEndDate: number;
}

const CollectionOfferMade = ({ isOpen, onDismiss, collection, offerPrice, offerEndDate }: IConfirmModalProps) => {
  const navigate = useNavigate();

  const handleViewOffer = () => {
    onDismiss();
    if (_.isEmpty(collection.url)) navigate(`/collections/${collection.url}?tab=activity`);
    else navigate(`/collections/id/${collection?._id}?tab=activity`);
  };
  return (
    <Dialog
      open={isOpen}
      onClose={onDismiss}
      aria-labelledby="customized-dialog-title"
      PaperProps={{ style: { background: '#1E1E1E', borderRadius: 15 } }}
    >
      <CustomDialogTitle id="customized-dialog-title" onClose={onDismiss}>
        <Stack direction="row" alignItems="center">
          Offer made
          <CardMedia component="img" image={bunch} alt="bunch" sx={{ width: 20, height: 20, ml: 2 }} />
        </Stack>
      </CustomDialogTitle>
      <DialogContent dividers>
        <Typography>
          You have made an offer of {offerPrice} ETH for any item. Please ensure to keep enough ETH in your wallet to
          pay when a seller accepts your offer, or the offer would be void. <br /> <br /> Once the seller accepts your
          offer the item will be sent to your wallet and <br /> <br /> Your offer is valid:
        </Typography>
        <Typography>
          <span style={{ color: '1E1E1W' }}>From: </span>
          {new Date(Date.now()).toISOString()} <span style={{ color: '1E1E1W' }}>&nbsp; To:</span>{' '}
          {new Date(offerEndDate).toISOString()}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', width: '100%' }}>
        <Button
          href="#"
          size="large"
          color="secondary"
          variant="contained"
          sx={{ py: 1, m: 3, fontWeight: 'bold', width: '100%', border: 0 }}
          onClick={handleViewOffer}
        >
          View your offers
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CollectionOfferMade;
