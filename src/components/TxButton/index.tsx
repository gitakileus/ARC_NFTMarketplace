import { Button, ButtonProps, CircularProgress } from '@mui/material';
import React from 'react';

interface IProps extends ButtonProps {
  children: any;
  loading: boolean;
}

export default function TxButton({ children, loading = false, ...props }: IProps) {
  return (
    <Button {...props} disabled={loading}>
      {loading ? <CircularProgress color="inherit" /> : children}
    </Button>
  );
}
