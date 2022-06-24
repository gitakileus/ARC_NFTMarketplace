import { CheckCircleOutlineRounded, CheckCircleRounded, Close } from '@mui/icons-material';
import {
  Box,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import React, { useState, useEffect } from 'react';

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
}

const labelSign = { inputProps: { 'aria-label': 'Sign' } };

const CollectionOfferConfirm = ({ isOpen, onDismiss }: IConfirmModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onDismiss}
      aria-labelledby="customized-dialog-title"
      PaperProps={{ style: { background: '#1E1E1E', borderRadius: 10 } }}
    >
      <CustomDialogTitle id="customized-dialog-title" onClose={onDismiss}>
        Offer in progress...
      </CustomDialogTitle>
      <DialogContent dividers>
        <Stack direction="row" alignItems="center">
          <Checkbox
            {...labelSign}
            checkedIcon={<CheckCircleRounded />}
            icon={<CheckCircleOutlineRounded />}
            disabled
            checked
          />
          Sign in wallet
        </Stack>
        <Stack direction="row" alignItems="start">
          <CircularProgress sx={{ ml: 1, mr: 2, my: 2, color: '#0070ff' }} size={20} />
          <Box sx={{ py: 1 }}>
            <Typography sx={{ fontSize: 16 }}>Confirm collection offer</Typography>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Confirm the transaction in your wallet
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionOfferConfirm;
