import { Close } from '@mui/icons-material';
import { Avatar, Box, Button, Grid, IconButton, Modal, Tab, Tabs, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { INFT } from 'interfaces/INFT';
import { IPerson } from 'interfaces/IPerson';
import React, { useEffect, useState } from 'react';
import { useGetNftsQuery, useUpdateMutation, useUploadPhotoMutation } from 'services/owner';

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

interface IProps {
  open: boolean;
  user: IPerson;
  onChange: (photoUrl?: string) => void;
}

export default function ChooseNFTModal(props: IProps) {
  const { open, user, onChange } = props;
  const [tabIndex, setTabIndex] = useState(0);
  const [nfts, setNfts] = useState<INFT[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [avatarFile, setAvatarFile] = React.useState<File>();

  const [updateUser] = useUpdateMutation();
  const [uploadPhoto] = useUploadPhotoMutation();
  const { data: itemsResponse } = useGetNftsQuery(user.wallet);

  const handleTabIndexChange = (e: any, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleUserAvatarChange = (event: any) => {
    setAvatarFile(event.target.files[0]);
  };

  const handleSaveImage = async () => {
    if (tabIndex === 0) {
      if (selectedId) {
        const nft = nfts.find((nft) => nft?._id === selectedId);
        await updateUser({
          address: user.wallet,
          photoUrl: nft?.artURI,
        });
        onChange(nft?.artURI);
      } else {
        alert('Please select the NFT');
      }
    } else {
      if (avatarFile) {
        const body = new FormData();
        body.append('photoFile', avatarFile);
        const { data, success } = await uploadPhoto({ address: user.wallet, body }).unwrap();
        if (success) {
          onChange(data.photoUrl);
        }
      } else {
        alert('Please select the file');
      }
    }
  };

  useEffect(() => {
    if (itemsResponse) {
      setNfts(itemsResponse.data);
    }
  }, [itemsResponse]);

  return (
    <Modal open={open} onClose={() => onChange()}>
      <StyledProfileModal>
        <IconButton onClick={() => onChange()} sx={{ position: 'absolute', top: '30px', right: '30px' }}>
          <Close />
        </IconButton>
        <Typography variant="subtitle1" sx={{ paddingBottom: '10px', fontWeight: 700 }}>
          Choose NFT
        </Typography>
        <Box sx={{ my: 3 }}>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'flex-start',
              alignItems: 'center',
              borderBottom: 1,
              borderColor: 'grey.800',
              my: 3,
            }}
          >
            <Box sx={{ borderColor: 'divider' }}>
              <Tabs value={tabIndex} onChange={handleTabIndexChange}>
                <Tab label="My NFT" sx={{ textTransform: 'none ', fontWeight: 600 }} />
                <Tab label="Upload from device" sx={{ textTransform: 'none ', fontWeight: 600 }} />
              </Tabs>
            </Box>
          </Box>
          <Box>
            {tabIndex === 0 ? (
              <Grid container spacing={2} sx={{ height: '300px' }}>
                {nfts.map((nft: INFT) => (
                  <Grid item key={nft._id} xs={4} onClick={() => setSelectedId(nft._id)}>
                    <img
                      src={nft.artURI}
                      alt="nft"
                      style={{
                        width: '100%',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        border: nft._id === selectedId ? '2px solid #fff' : 'none',
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box
                sx={{
                  height: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {avatarFile && <Avatar src={URL.createObjectURL(avatarFile)} sx={{ width: 120, height: 120, mb: 3 }} />}
                <Typography sx={{ fontSize: 20, mb: 3, fontWeight: 600 }}>Upload from device</Typography>
                <label htmlFor="user-avatar-file">
                  <input
                    id="user-avatar-file"
                    type="file"
                    accept="image/*"
                    onChange={handleUserAvatarChange}
                    style={{ display: 'none' }}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    component="span"
                    sx={{
                      fontWeight: 600,
                      borderRadius: '6px',
                      width: '160px',
                      background: '#2c2c2c',
                      color: 'white',
                    }}
                  >
                    {avatarFile ? 'Change' : 'Upload'} image
                  </Button>
                </label>
              </Box>
            )}
          </Box>
        </Box>
        <Button
          variant="contained"
          color="secondary"
          sx={{ width: '100%', color: 'white', paddingY: '14px', marginTop: '40px', borderRadius: 2, fontWeight: 600 }}
          onClick={handleSaveImage}
        >
          Save image
        </Button>
      </StyledProfileModal>
    </Modal>
  );
}
