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
import copy from 'assets/Icon/copy.svg';
import facebook from 'assets/social/facebook.svg';
import telegram from 'assets/social/telegram.svg';
import twitter from 'assets/social/twitter.svg';
import { INFTCollection } from 'interfaces/INFTCollection';
import _ from 'lodash';
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

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

const CollectionSuccessModal = ({
  isOpen,
  collection,
  onDismiss,
  createOrUpdate,
}: {
  isOpen: boolean;
  collection: INFTCollection;
  onDismiss: () => void;
  createOrUpdate: boolean;
}) => {
  const navigate = useNavigate();
  return (
    <Dialog open={isOpen} onClose={onDismiss} PaperProps={{ style: { background: '#1E1E1E' } }}>
      <CustomDialogTitle id="customized-dialog-title" onClose={onDismiss}>
        Collection {createOrUpdate ? 'Created' : 'Updated'}
      </CustomDialogTitle>
      <DialogContent dividers sx={{ justifyContent: 'center', alignItems: 'center', textAlign: '-webkit-center' }}>
        <CardMedia
          component="img"
          image={collection.logoUrl}
          alt="snoopy"
          sx={{ width: '200px', height: '200px', borderRadius: 3 }}
        />
        <Typography sx={{ my: 3 }}>
          You just {createOrUpdate ? 'created' : 'updated'} a new collection &quot;{collection.name}&quot;
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', width: '100%' }}>
        <Button
          href="#"
          size="large"
          color="secondary"
          variant="contained"
          sx={{ m: 2, fontWeight: 'bold', width: '200px', border: 0, padding: '10px' }}
          onClick={() => {
            navigate(`/explore`);
            window.location.reload();
          }}
        >
          Back to explore
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CollectionSuccessModal;
