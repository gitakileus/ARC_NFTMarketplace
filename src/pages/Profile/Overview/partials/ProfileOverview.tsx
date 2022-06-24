import { ExpandMore } from '@mui/icons-material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { Box, Container, Stack, Button, IconButton, Menu, MenuItem, Typography, CardMedia, Grid } from '@mui/material';
import ProfileMDIMG from 'assets/profile.png';
import ProfileEditModal from 'pages/Profile/Overview/partials/ProfileEditModal';
import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useNavigate } from 'react-router-dom';
import { TwitterShareButton } from 'react-share';
import { FacebookIcon, TwitterIcon } from 'react-share';
import { useModalOpen, useProfileEditModalToggle } from 'state/application/hooks';
import { ApplicationModal } from 'state/application/reducer';
import { useAppSelector } from 'state/hooks';
import { shortenAddress } from 'utils';

type IProps = {
  wallet: string;
  username?: string;
  isShare?: boolean;
};

export default function ProfileOverview({ wallet, username, isShare = false }: IProps) {
  const [anchorEl, setAnchorEl] = useState(null);
  const createMenuOpen = Boolean(anchorEl);
  const navigate = useNavigate();
  const isProfileEditModalOpen = useModalOpen(ApplicationModal.PROFILE_EDIT);
  const toggleProfileEditModal = useProfileEditModalToggle();
  const { user } = useAppSelector((state) => state.user);

  return (
    <>
      <Container>
        {!isShare && (
          <Grid container direction="column" spacing={2}>
            <Grid item order={{ xs: 2, sm: 1 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
              >
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#2C2C2C',
                    color: '#FFF',
                    boxShadow: '5px 7px 6px 0px rgba(0,0,0,0.25) !important',
                    fontWeight: 6000,
                  }}
                  onClick={toggleProfileEditModal}
                >
                  Edit profile
                </Button>
                <Stack direction="row" alignItems="center">
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                      borderRadius: '10px',
                      marginRight: '16px',
                      paddingX: '24px',
                      paddingY: '13px',
                      fontWeight: 600,
                    }}
                    onClick={(event: any) => {
                      setAnchorEl(event.currentTarget);
                    }}
                  >
                    Create <ExpandMore sx={{ marginLeft: '14px' }} />
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={createMenuOpen}
                    onClose={() => setAnchorEl(null)}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem onClick={() => navigate('/items/create')}>Item</MenuItem>
                    <MenuItem onClick={() => navigate('/collections/create')}>Collection</MenuItem>
                  </Menu>

                  <Button
                    variant="outlined"
                    href="/profile/import"
                    sx={{ borderRadius: '10px', paddingX: '24px', paddingY: '13px', fontWeight: 600 }}
                  >
                    Import listings
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid item order={{ xs: 1, sm: 2 }}>
              <Stack spacing={1} alignItems="center" sx={{ pt: { xs: 12, sm: 12, md: 12, lg: 0 } }}>
                <CardMedia
                  component="img"
                  image={user.photoUrl ? user.photoUrl : ProfileMDIMG}
                  alt="Profile"
                  sx={{ width: '120px', height: '120px', borderRadius: '50%' }}
                />
                <Typography
                  sx={{ color: 'white', fontSize: '32px', lineHeight: '150%', fontWeight: 'bold', marginTop: '24px' }}
                >
                  {username ? username : shortenAddress(wallet)}
                </Typography>
                {!isShare && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '16px',
                      marginBottom: '56px',
                      alignItems: 'baseline',
                    }}
                  >
                    <CopyToClipboard text={wallet}>
                      <IconButton sx={{ marginRight: '24px' }}>
                        <ContentCopyIcon sx={{ width: '24px', height: '24px' }} />
                      </IconButton>
                    </CopyToClipboard>
                    <IconButton
                      sx={{ marginRight: '24px' }}
                      href={`https://etherscan.io/address/${wallet}`}
                      target="_blank"
                    >
                      <OpenInNewIcon sx={{ width: '24px', height: '24px' }} />
                    </IconButton>
                    <IconButton
                      href={`https://arc.market/profile/share/${wallet}`}
                      target="_blank"
                      sx={{ marginRight: '1px' }}
                    >
                      <TwitterIcon size={22} round></TwitterIcon>
                    </IconButton>
                  </Box>
                )}
              </Stack>
            </Grid>
          </Grid>
        )}
      </Container>
      {!isShare && <ProfileEditModal open={isProfileEditModalOpen} handleClose={toggleProfileEditModal} />}
    </>
  );
}
