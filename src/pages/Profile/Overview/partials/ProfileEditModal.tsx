import ChooseNFTModal from './ChooseNFTModal';
import { Close } from '@mui/icons-material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Button, IconButton, Input, Modal, TextField, Typography } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import ProfileLogo from 'components/ProfileLogo';
import React, { useEffect, useState } from 'react';
import { useUpdateMutation } from 'services/owner';
import { useChooseAvatarModalToggle, useModalOpen } from 'state/application/hooks';
import { ApplicationModal } from 'state/application/reducer';
import { useAppDispatch, useAppSelector } from 'state/hooks';
import { setUser, setUserProfileImage } from 'state/user/actions';
import { shortenAddress } from 'utils';

const screenWidth = window.innerWidth;
const isMobile = screenWidth < 768 ? true : false;

const StyledProfileModal = styled('div')(() => ({
  position: 'absolute',
  backgroundColor: '#1E1E1E',
  borderRadius: '10px',
  width: isMobile ? '100%' : '580px',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '40px',
}));

const StyledProfileLabel = styled('p')(() => ({
  color: '#8D8D8D',
  fontSize: '12px',
  fontStyle: 'normal',
  fontWeight: 500,
  lineHeight: '19px',
  marginBottom: '8px',
}));

interface IProps {
  open: boolean;
  handleClose: () => void;
}

export default function ProfileEditModal(props: IProps) {
  const { open, handleClose } = props;
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [updateUser] = useUpdateMutation();

  const isChooseAvatarModalOpen = useModalOpen(ApplicationModal.CHOOSE_AVATAR);
  const toggleChooseAvatarModal = useChooseAvatarModalToggle();

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [social, setSocial] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUsername(user.username ?? '');
    setEmail(user.email ?? '');
    setBio(user.bio ?? '');
    setSocial(user.social ?? '');
  }, [user]);

  const handleProfileImageChange = (photoUrl?: string) => {
    toggleChooseAvatarModal();
    if (photoUrl) {
      dispatch(setUserProfileImage(photoUrl));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    await updateUser({
      address: user.wallet,
      username,
      email,
      bio,
      social,
    });
    dispatch(setUser({ ...user, username, email, bio, social }));
    setIsLoading(false);
    handleClose();
  };

  const onRemove = () => {
    dispatch(setUserProfileImage(''));
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <StyledProfileModal>
          <IconButton onClick={handleClose} sx={{ position: 'absolute', top: '30px', right: '30px' }}>
            <Close />
          </IconButton>
          <Typography variant="subtitle1" sx={{ paddingBottom: '24px', fontWeight: 700 }}>
            Edit profile
          </Typography>
          <StyledProfileLabel sx={{ fontWeight: 600 }}>Wallet address</StyledProfileLabel>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box
              sx={{
                background: '#232323',
                border: '1px solid #2c2c2c',
                borderRadius: '10px',
                py: 1,
                px: 1,
                display: 'flex',
                alignItems: 'center',
                flex: 1,
                width: '100%',
              }}
            >
              <Typography variant="body2">{isMobile ? shortenAddress(user.wallet) : user.wallet}</Typography>
              <IconButton>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>
            <IconButton
              sx={{ ml: 1, border: '1px solid #2c2c2c', borderRadius: '10px', background: '#232323', p: 2 }}
              href={`https://etherscan.io/address/${user.wallet}`}
            >
              <OpenInNewIcon />
            </IconButton>
          </Box>
          <Box sx={{ marginTop: '24px' }}>
            <StyledProfileLabel sx={{ fontWeight: 600 }}>Profile image</StyledProfileLabel>
            <Box sx={{ display: 'flex' }}>
              <ProfileLogo photoUrl={user.photoUrl} size="large" />
              <Button
                variant="contained"
                sx={{
                  mr: 1,
                  ml: 2,
                  height: '40px',
                  alignSelf: 'center',
                  fontWeight: 700,
                  backgroundColor: '#2C2C2C',
                  color: '#FFF',
                  boxShadow: 'none !important',
                }}
                onClick={toggleChooseAvatarModal}
              >
                Choose NFT
              </Button>
              <Button
                variant="text"
                sx={{
                  alignSelf: 'center',
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#FFF',
                }}
                onClick={() => onRemove()}
              >
                Remove
              </Button>
            </Box>
          </Box>
          <Box sx={{ marginTop: '24px' }}>
            <StyledProfileLabel sx={{ fontWeight: 600 }}>Nickname</StyledProfileLabel>
            <Input
              type="text"
              placeholder="Enter nickname"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ width: '100%', paddingY: '16px', fontWieght: 'normal', fontSize: '14px' }}
            />
          </Box>
          <Box sx={{ marginTop: '24px' }}>
            <StyledProfileLabel sx={{ fontWeight: 600 }}>Email</StyledProfileLabel>
            <Input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ width: '100%', paddingY: '16px', fontWieght: 'normal', fontSize: '14px' }}
            />
          </Box>
          <Box sx={{ marginTop: '24px' }}>
            <StyledProfileLabel sx={{ fontWeight: 600 }}>Bio</StyledProfileLabel>
            <TextField
              placeholder="Enter your bio"
              multiline
              rows={4}
              variant="standard"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              sx={{ width: '100%', fontWeight: 'normal', fontSize: '14px' }}
            />
          </Box>
          <Box sx={{ marginTop: '24px' }}>
            <StyledProfileLabel sx={{ fontWeight: 600 }}>Social</StyledProfileLabel>
            <Input
              type="text"
              placeholder="Enter your website"
              sx={{ width: '100%', paddingY: '16px', fontWieght: 'normal' }}
              value={social}
              onChange={(e) => setSocial(e.target.value)}
            />
          </Box>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              width: '100%',
              color: 'black',
              paddingY: '14px',
              marginTop: '40px',
              borderRadius: 2,
              fontWeight: 600,
            }}
            onClick={handleSave}
          >
            Save
          </Button>
        </StyledProfileModal>
      </Modal>
      <ChooseNFTModal open={isChooseAvatarModalOpen} user={user} onChange={handleProfileImageChange} />
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
