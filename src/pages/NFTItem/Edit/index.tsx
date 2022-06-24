import { AcUnit, LockOpen } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Grid,
  ListItemIcon,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import UploadImage from 'components/UploadImage';
import React, { useEffect } from 'react';

const EditItem = () => {
  const [collection, setCollection] = React.useState('1');
  const [chain, setChain] = React.useState('1');
  const [unlockCheck, setUnlockCheck] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState<File>();
  const handleCollection = (event: SelectChangeEvent) => {
    setCollection(event.target.value);
  };
  const handleChain = (event: SelectChangeEvent) => {
    setChain(event.target.value);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Container>
      <Typography variant="h3">Edit Item</Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Please do well to fill all the fields with the required sign
      </Typography>

      <Grid container alignItems="center" sx={{ mt: 3 }} spacing={5}>
        <Grid item sm={12} md={6} order={{ xs: 2, sm: 1 }}>
          <UploadImage id="editItemImage" width={360} height={300} imageFile={imageUrl} setImageFile={setImageUrl} />
        </Grid>
        <Grid item sm={12} md={6} order={{ xs: 1, sm: 2 }}>
          <Typography variant="h4" fontWeight={600}>
            Image, Video, Audio, or 3D Model
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Supported files include: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF, with a mx size of 100MB
          </Typography>
          <Button
            sx={{ background: '#2C2C2C', color: 'white', fontWeight: 500, my: 2 }}
            color="secondary"
            size="medium"
            variant="contained"
          >
            Change Item
          </Button>
        </Grid>
      </Grid>
      {/* Collection Name */}
      <Typography variant="h5" fontWeight={600}>
        Collection Name
      </Typography>
      <TextField
        id="CollectionName"
        autoComplete="given-name"
        name="CollectionName"
        required
        fullWidth
        autoFocus
        placeholder="Enter name"
        sx={{ my: 2 }}
      />
      {/* URL */}
      <Typography variant="h5" fontWeight={600}>
        URL
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        Customize your collections URL on DePo, you can only include lowercases, numbers and a hyphen
      </Typography>
      <TextField
        id="ExternalLink"
        autoComplete="given-name"
        name="ExternalLink"
        required
        fullWidth
        autoFocus
        placeholder="https://arc.market"
        sx={{ my: 2 }}
      />
      {/* Description */}
      <Typography variant="h5" fontWeight={600}>
        Description
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        The description would be visible to potential buyers on the items details pcollection
      </Typography>
      <TextField
        id="Description"
        autoComplete="given-name"
        name="Description"
        required
        multiline
        fullWidth
        autoFocus
        rows={3}
        placeholder="Tell us what's so great about this item"
        sx={{ my: 2 }}
      />
      {/* Category */}
      <Typography variant="h5" fontWeight={600}>
        Category
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        You can select just one category, this groups the collection with other collections with the same category and
        makes it easy to find
      </Typography>
      <Select
        sx={{ my: 2 }}
        value={collection}
        fullWidth
        onChange={handleCollection}
        inputProps={{ 'aria-label': 'Without label' }}
      >
        <MenuItem value={1} autoFocus>
          <img
            loading="lazy"
            width="20"
            src="https://flagcdn.com/w20/us.png"
            srcSet="https://flagcdn.com/w40/us.png 2x"
            alt="ENG"
          />
          &nbsp; Unnamed Collection
        </MenuItem>
        <MenuItem value={2}>
          <img
            loading="lazy"
            width="20"
            src="https://flagcdn.com/w20/cn.png"
            srcSet="https://flagcdn.com/w40/cn.png 2x"
            alt="ENG"
          />
          &nbsp; Named Collection
        </MenuItem>
      </Select>
      {/* Links */}
      <Typography variant="h5" fontWeight={600}>
        Links
      </Typography>
      <TextField
        id="ExternalLink"
        autoComplete="given-name"
        name="ExternalLink"
        required
        fullWidth
        autoFocus
        placeholder="https://depo.com/collection/customize"
        sx={{ my: 2 }}
      />
      {/* Unlockable Content */}
      <Stack direction="row" spacing={3} marginY={3}>
        <ListItemIcon>
          <Box sx={{ backgroundColor: '#1E1E1E', borderRadius: 2, width: '50px', height: '50px' }}>
            <LockOpen sx={{ m: 1.5 }} />
          </Box>
        </ListItemIcon>
        <Stack spacing={1}>
          <Typography variant="h5" fontWeight={600}>
            Unlockable Content
          </Typography>
          <Typography variant="subtitle2">
            Include unlockable content that can only be revealed by the owner of the item
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Switch
              checked={unlockCheck}
              onChange={() => setUnlockCheck(!unlockCheck)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Stack>
          {unlockCheck && (
            <TextField
              id="unlockContent"
              autoComplete="given-name"
              name="unlockContent"
              required
              multiline
              fullWidth
              autoFocus
              rows={3}
              placeholder="Enter content (access key, code to redeem, link to a file, etc.)"
              sx={{ my: 2 }}
            />
          )}
        </Stack>
      </Stack>
      {/* Explicit & Sensitive Content */}
      <Stack direction="row" spacing={3} marginY={3}>
        <ListItemIcon>
          <Box sx={{ backgroundColor: '#1E1E1E', borderRadius: 2, width: '50px', height: '50px' }}>
            <LockOpen sx={{ m: 1.5 }} />
          </Box>
        </ListItemIcon>
        <Stack spacing={1}>
          <Typography variant="h5" fontWeight={600}>
            Explicit & Sensitive Content
          </Typography>
          <Typography variant="subtitle2">Set this item as explicit and sensitive content</Typography>
          <Switch />
        </Stack>
      </Stack>
      {/* Blockchain */}
      <Typography variant="h5" fontWeight={600}>
        Blockchain
      </Typography>
      <Select
        sx={{ my: 3 }}
        value={chain}
        fullWidth
        onChange={handleChain}
        inputProps={{ 'aria-label': 'Without label' }}
      >
        <MenuItem value={1} autoFocus>
          <img
            loading="lazy"
            width="20"
            src="https://flagcdn.com/w20/us.png"
            srcSet="https://flagcdn.com/w40/us.png 2x"
            alt="ENG"
          />
          &nbsp; Ethereum
        </MenuItem>
        <MenuItem value={2}>
          <img
            loading="lazy"
            width="20"
            src="https://flagcdn.com/w20/cn.png"
            srcSet="https://flagcdn.com/w40/cn.png 2x"
            alt="ENG"
          />
          &nbsp; Binance
        </MenuItem>
      </Select>
      {/* Freeze Metadata */}
      <Stack direction="row" spacing={3} marginY={3}>
        <ListItemIcon>
          <Box sx={{ backgroundColor: '#1E1E1E', borderRadius: 2, width: '50px', height: '50px' }}>
            <AcUnit sx={{ m: 1.5 }} />
          </Box>
        </ListItemIcon>
        <Stack spacing={1}>
          <Typography variant="h5" fontWeight={600}>
            Freeze Metadata
          </Typography>
          <Typography variant="subtitle2">
            Freezing your metadata will allow you to permanently lock and store all of this items content in a
            decentralized file storage
          </Typography>
          <Switch />
        </Stack>
      </Stack>

      {/* Save */}
      <Stack direction="row" justifyContent="space-between">
        <Button size="large" variant="contained" sx={{ fontWeight: 800 }}>
          Save changes
        </Button>
        <Button size="large" variant="outlined" sx={{ fontWeight: 800 }}>
          Delete Item
        </Button>
      </Stack>
    </Container>
  );
};

export default EditItem;
