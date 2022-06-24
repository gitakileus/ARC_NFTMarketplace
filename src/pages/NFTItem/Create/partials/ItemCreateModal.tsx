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
import snoopy from 'assets/NFT/Snoopy.png';
import facebook from 'assets/social/facebook.svg';
import telegram from 'assets/social/telegram.svg';
import twitter from 'assets/social/twitter.svg';
import React from 'react';
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
  onListforSale: () => void;
  imageUrl?: string;
  name?: string;
  collectionId?: string;
}

const ItemCreateModal = ({ isOpen, onDismiss, onListforSale, imageUrl, name, collectionId }: IConfirmModalProps) => {
  const navigate = useNavigate();
  const handleExplore = () => {
    navigate(`/explore`);
    onDismiss();
  };
  const handleVisitCollection = () => {
    navigate(`/collections/id/${collectionId}`);
    onDismiss();
  };
  const handleListforSale = () => {
    onListforSale();
    onDismiss();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onDismiss}
      aria-labelledby="customized-dialog-title"
      PaperProps={{ style: { background: '#1E1E1E' } }}
    >
      <CustomDialogTitle id="customized-dialog-title" onClose={onDismiss}>
        Item Created
      </CustomDialogTitle>
      <DialogContent dividers sx={{ justifyContent: 'center', alignItems: 'center', textAlign: '-webkit-center' }}>
        <CardMedia
          component="img"
          image={imageUrl ? imageUrl : snoopy}
          alt="snoopy"
          sx={{ width: '200px', height: '200px', borderRadius: 3 }}
        />
        <Typography sx={{ my: 3 }}>You just created a new item &quot;{name ? name : 'Collection'} &quot;</Typography>
        {/* <Stack direction="row" alignItems="center" spacing={2} justifyContent="center" marginY={2}>
        <CardMedia component="img" image={telegram} alt="telegram" sx={{ width: '30px', height: '30px' }} />
        <CardMedia component="img" image={twitter} alt="telegram" sx={{ width: '30px', height: '30px' }} />
        <CardMedia component="img" image={facebook} alt="telegram" sx={{ width: '30px', height: '30px' }} />
        <CardMedia component="img" image={copy} alt="telegram" sx={{ width: '30px', height: '30px' }} />
      </Stack>
      <Typography variant="subtitle2" color="text.secondary">
        Share your item on various social channels
      </Typography> */}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', width: '100%' }}>
        <Button
          href="#"
          size="large"
          color="secondary"
          variant="contained"
          sx={{ py: 1, px: 0, m: 3, fontWeight: 'bold', width: '200px', border: 0 }}
          onClick={handleListforSale}
        >
          List For Sale
        </Button>
        <Button
          href="#"
          size="large"
          color="secondary"
          variant="contained"
          sx={{ py: 1, px: 1, m: 3, fontWeight: 'bold', width: '200px', border: 0 }}
          onClick={handleVisitCollection}
        >
          Visit Collection
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ItemCreateModal;
