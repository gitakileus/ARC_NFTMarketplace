import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

export const RoundedTextField = styled(TextField)(() => ({
  '& fieldset': {
    borderRadius: '10px',
  },
  input: {
    padding: '8px 16px',
  },
}));

export default RoundedTextField;
