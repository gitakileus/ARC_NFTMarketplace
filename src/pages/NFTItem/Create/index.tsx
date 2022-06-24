import ListForSaleModal from '../partials/modals/ListForSaleModal';
import ItemCreateModal from './partials/ItemCreateModal';
import { DeleteOutline, FormatListBulleted, LockOpen } from '@mui/icons-material';
import {
  Box,
  Button,
  CardMedia,
  Container,
  Grid,
  ListItemIcon,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  FormGroup,
} from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { SelectChangeEvent } from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import add from 'assets/Icon/add.svg';
import GlowEffectContainer from 'components/GlowEffectContainer';
import TxButton from 'components/TxButton';
import UploadImage from 'components/UploadImage';
import { INFTCollection } from 'interfaces/INFTCollection';
import _ from 'lodash';
import React, { useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useCreateMutation, useBatchUploadMutation } from 'services/item';
import { useGetCollectionsQuery } from 'services/owner';
import { useModalOpen, useListForSaleModalToggle } from 'state/application/hooks';
import { ApplicationModal } from 'state/application/reducer';
import { useAppSelector } from 'state/hooks';
import { isAddress, SITE_KEY } from 'utils';

const StyledBadge = styled('span')(() => ({
  color: `rgb(241, 45, 40)`,
}));

const AntSwitch = styled(Switch)(() => ({
  width: 36,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 12,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      color: '#007aff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#5c5c5c',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    color: '#007aff',
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: '#5c5c5c',
    boxSizing: 'border-box',
  },
}));

interface IProperty {
  title: string;
  name: string;
}

const CreateItem = () => {
  const [handleCreateHook, { error, isLoading }] = useCreateMutation();
  const [handleBatchUploadHook] = useBatchUploadMutation();
  const { user } = useAppSelector((state) => state.user);

  const [batchMode, setBatchMode] = React.useState<boolean>(false);
  const [collectionIdx, setCollectionIdx] = React.useState<string>('');
  const [chain, setChain] = React.useState('0');
  const [unlockCheck, setUnlockCheck] = React.useState(false);
  const [dialog, setDialog] = React.useState(false);
  const [property, setProperty] = React.useState<Array<IProperty>>([]);
  const [propertyLoading, setPropertyLoading] = React.useState(0);
  const [imageUrl, setImageUrl] = React.useState<File>();
  const [nftItemName, setNftItemName] = React.useState('');
  const [nftLink, setNftLink] = React.useState('');
  const [nftDesc, setNftDesc] = React.useState('');
  const [explicit, setExplicit] = React.useState(false);
  const [unlockDesc, setUnlockDesc] = React.useState('');
  const [creatingError, setCreatingError] = React.useState<string>();
  const [requiredEmpty, setRequiredEmpty] = React.useState<string>();
  const blockchainList = ['ERC721', 'ERC1155'];
  const [collections, setCollections] = React.useState<INFTCollection[]>([]);
  const [collectionId, setCollectionId] = React.useState<string | null>(null);
  const [nftId, setNftId] = React.useState<number | null>(null);

  useEffect(() => {
    if (collections[+collectionIdx] && !_.isEmpty(collections[+collectionIdx].properties)) {
      setPropertyLoading(1);
      const list: Array<IProperty> = [];
      Object.keys(collections[+collectionIdx].properties).map((x: string, i: number) => {
        list.push({ title: x, name: '' });
      });
      setProperty(list);
      setPropertyLoading(2);
    }
  }, [collections, collectionIdx]);

  const isListForSaleModalOpen = useModalOpen(ApplicationModal.LIST_FOR_SALE);
  const toggleListForSaleModal = useListForSaleModalToggle();

  const [captcha, setCaptcha] = React.useState<string | null>(null);

  const { data: collectionsResponse } = useGetCollectionsQuery(user.wallet);

  useEffect(() => {
    if (collectionsResponse && collectionsResponse.data) {
      setCollections(collectionsResponse.data);
    }
  }, [collectionsResponse]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [collections]);

  const handleCollection = (event: SelectChangeEvent) => {
    if (collections[+event.target.value].blockchain === 'ERC721') setChain('0');
    else if (collections[+event.target.value].blockchain === 'ERC1155') setChain('1');
    const collectionNumber = event.target.value;
    setCollectionIdx(collectionNumber);
  };

  const handleChain = (event: SelectChangeEvent) => {
    setChain(event.target.value);
  };

  // handle input change
  const handleInputChange = (e: any, x: string, index: number) => {
    const { value } = e.target;
    const list = [...property];
    list[index].title = x;
    list[index].name = value;
    setProperty(list);
  };

  const handleCreateSingleItem = async () => {
    let retVal;
    let requiredTxt = ' mandatory.';
    const requireFields = [];
    if (!imageUrl) requireFields.push('NFT image');
    if (!nftItemName) requireFields.push('NFT item name');
    if (collectionIdx === '') {
      requireFields.push('Choosing collection');
    }

    if (!imageUrl || !nftItemName || collectionIdx === '') {
      if (requireFields.length === 1) requiredTxt = requireFields[0] + ' is' + requiredTxt;
      else {
        let reqitemTxt = '';
        requireFields.forEach((reqitem, idx) => {
          reqitemTxt = reqitemTxt + reqitem + (idx === requireFields.length - 1 ? '' : ', ');
        });
        requiredTxt = reqitemTxt + ' are' + requiredTxt;
      }
      setRequiredEmpty(requiredTxt);
    }
    if (imageUrl && nftItemName && collectionIdx !== '' && captcha) {
      // eslint-disable-next-line prefer-const
      let nftItem = new FormData();
      try {
        nftItem.append('artFile', imageUrl, imageUrl.name);
        nftItem.append('tokenType', blockchainList[+chain]);
        nftItem.append('name', nftItemName);
        nftItem.append('externalLink', nftLink);
        nftItem.append('collectionId', collections[+collectionIdx]._id);
        nftItem.append('properties', JSON.stringify(property));
        nftItem.append('lockContent', unlockDesc);
        nftItem.append('isExplicit', explicit ? 'true' : 'false');
        nftItem.append('description', nftDesc);
        retVal = await handleCreateHook(nftItem).unwrap();
      } catch (e) {
        console.log(e);
      }
      if (retVal?.success === true) {
        setDialog(true);
        if (collectionIdx !== '') {
          setCollectionId(collections[+collectionIdx]._id);
        }
        setNftId(+retVal?.data?.index);
        window.gtag('event', 'nft_lazy_minted');
      } else {
        setCreatingError(retVal?.status);
      }
    }
  };

  const handleCreateBatchItems = async () => {
    let retVal;
    let requiredTxt = ' mandatory.';
    const requireFields = [];
    if (!imageUrl) requireFields.push('CSV file');
    if (collectionIdx === '') {
      requireFields.push('Choosing collection');
    }

    if (!imageUrl || collectionIdx === '') {
      if (requireFields.length === 1) requiredTxt = requireFields[0] + ' is' + requiredTxt;
      else {
        let reqitemTxt = '';
        requireFields.forEach((reqitem, idx) => {
          reqitemTxt = reqitemTxt + reqitem + (idx === requireFields.length - 1 ? '' : ', ');
        });
        requiredTxt = reqitemTxt + ' are' + requiredTxt;
      }
      setRequiredEmpty(requiredTxt);
    }

    if (imageUrl && collectionIdx !== '' && captcha) {
      const batchUploadForm = new FormData();
      try {
        batchUploadForm.append('csvFile', imageUrl, imageUrl.name);
        batchUploadForm.append('tokenType', blockchainList[+chain]);
        batchUploadForm.append('collectionId', collections[+collectionIdx]._id);
        retVal = await handleBatchUploadHook(batchUploadForm).unwrap();
      } catch (e) {
        console.log(e);
      }
      if (retVal?.success === true) {
        window.alert(batchMode ? 'Items uploaded successfully.' : 'Items created successfully.');
        window.gtag('event', 'Batch Lazy-minted');
      } else {
        setCreatingError(retVal?.status);
      }
    }
  };

  const renderProperty = () => {
    if (collections[+collectionIdx] && !_.isEmpty(collections[+collectionIdx].properties) && propertyLoading === 2) {
      // console.log('collections[+collectionIdx].properties :>> ', collections[+collectionIdx].properties);
      return Object.keys(collections[+collectionIdx].properties).map((x: string, i: number) => (
        <Grid container justifyContent="space-between" alignItems="end" key={i}>
          <Grid item sm={12} md={5}>
            <Typography sx={{ my: 2 }}>Title</Typography>
            <TextField name="title" placeholder="eg: character" value={x} disabled />
          </Grid>
          <Grid item sm={12} md={5}>
            <Typography sx={{ my: 2 }}>Name</Typography>
            <TextField
              className="ml10"
              name="name"
              value={property[i].name}
              onChange={(e) => handleInputChange(e, x, i)}
              required
            />
          </Grid>
        </Grid>
      ));
    }
  };
  return isAddress(user.wallet) && collections.length === 0 ? (
    <Container>
      <Typography variant="subtitle1">
        You don&apos;t have any collections. <br /> Create a collection so you can start creating items.
      </Typography>
    </Container>
  ) : (
    <Container>
      <Typography variant="h3">Create item</Typography>
      <Typography sx={{ fontSize: '16px', mt: 2, display: 'inline' }} color="text.secondary">
        Fields marked with an asterisk are required <StyledBadge> *</StyledBadge>
      </Typography>
      <FormGroup sx={{ display: 'inline-flex', float: 'right' }}>
        <Stack direction="row" spacing={1} alignItems="center" width="100">
          <Typography>Single</Typography>
          <AntSwitch
            inputProps={{ 'aria-label': 'ant design' }}
            value={batchMode}
            onChange={(e: any) => setBatchMode(e.target.checked)}
          />
          <Typography>Batch</Typography>
        </Stack>
      </FormGroup>
      {/* Upload Image or CSV */}
      <Grid container alignItems="center" sx={{ mt: 3 }} spacing={5}>
        <Grid item sm={12} md={5} order={{ xs: 2, sm: 1 }}>
          <Box sx={{ width: 'fit-content' }}>
            <GlowEffectContainer>
              <Box sx={{ backgroundColor: '#1e1e1e', borderRadius: '6px' }}>
                <UploadImage
                  id="uploadFile"
                  width={360}
                  height={300}
                  imageFile={imageUrl}
                  setImageFile={setImageUrl}
                  mode={batchMode ? 'CSV' : 'MEDIA'}
                />
              </Box>
            </GlowEffectContainer>
          </Box>
        </Grid>
        <Grid item sm={12} md={7} order={{ xs: 1, sm: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {batchMode ? 'CSV file' : 'Image, video, audio, or 3D model'}
            <StyledBadge> *</StyledBadge>
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
            {batchMode
              ? "Upload all of your NFT's at once and choose whether you'd like to mint now, or lazy mint easily. Upload your CSV file below to begin the process."
              : 'Supported files include: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF, with a max size of 100MB'}
          </Typography>
        </Grid>
      </Grid>
      {!batchMode && (
        <>
          {/* NFT Name */}
          <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 7 }}>
            NFT name<StyledBadge> *</StyledBadge>
          </Typography>
          <TextField
            id="NFTName"
            autoComplete="given-name"
            name="NFTName"
            required
            fullWidth
            autoFocus
            placeholder="Enter name"
            sx={{ my: 2, mt: 3 }}
            value={nftItemName}
            onChange={(e) => {
              setNftItemName(e.target.value.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase()));
            }}
          />
          {/* External Link */}
          <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 5 }}>
            External link
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
            Include a link to your website so that prospective buyers can learn more about the item or collection.
          </Typography>
          <TextField
            id="ExternalLink"
            autoComplete="given-name"
            name="ExternalLink"
            required
            fullWidth
            autoFocus
            placeholder="https://yourwebsite.com"
            sx={{ my: 2, mt: 3 }}
            value={nftLink}
            onChange={(e) => {
              setNftLink(e.target.value);
            }}
          />
          {/* Description */}
          <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 5 }}>
            Description
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
            The description would be visible to potential buyers on the items details page.
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
            sx={{ my: 2, mt: 3 }}
            value={nftDesc}
            onChange={(e) => {
              setNftDesc(e.target.value);
            }}
          />
        </>
      )}
      {/* Collection */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 5 }}>
        Collection<StyledBadge> *</StyledBadge>
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
        The collection under which this item will be hosted. If not specified, a default collection called
        &#34;Unnamed&#34; will be created which you can edit later. If you do want to add this item to a collection,
        ensure you have created the collection first.
      </Typography>
      <Select
        sx={{ my: 2, mt: 3 }}
        value={collectionIdx}
        fullWidth
        onChange={handleCollection}
        inputProps={{ 'aria-label': 'Without label' }}
        required
      >
        {collections.map((item, index: number) => (
          <MenuItem value={index} key={index} sx={{ alignItems: 'center' }}>
            <Stack direction="row" alignItems="center">
              <CardMedia
                component="img"
                image={item.logoUrl}
                alt="collection"
                sx={{ width: 20, height: 20, borderRadius: '50%' }}
              />
              &nbsp; {item.name}
            </Stack>
          </MenuItem>
        ))}
      </Select>
      {!batchMode && (
        <>
          {/* Properties */}
          <Stack direction="row" spacing={3} marginY={3} sx={{ mt: 7 }}>
            <ListItemIcon>
              <Box sx={{ backgroundColor: '#1E1E1E', borderRadius: 2, width: '50px', height: '50px' }}>
                <FormatListBulleted sx={{ m: 1.5 }} />
              </Box>
            </ListItemIcon>
            <Stack spacing={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                Properties
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Unique traits that are associated with this NFT.
              </Typography>
              {renderProperty()}
            </Stack>
          </Stack>
          {/* Unlockable Content */}
          <Stack direction="row" spacing={3} marginY={3} sx={{ mt: 7 }}>
            <ListItemIcon>
              <Box sx={{ backgroundColor: '#1E1E1E', borderRadius: 2, width: '50px', height: '50px' }}>
                <LockOpen sx={{ m: 1.5 }} />
              </Box>
            </ListItemIcon>
            <Stack spacing={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                Unlockable content
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
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
                  value={unlockDesc}
                  onChange={(e) => {
                    setUnlockDesc(e.target.value);
                  }}
                />
              )}
            </Stack>
          </Stack>
          {/* Explicit & Sensitive Content */}
          <Stack direction="row" spacing={3} marginY={3} sx={{ mt: 7 }}>
            <ListItemIcon>
              <Box sx={{ backgroundColor: '#1E1E1E', borderRadius: 2, width: '50px', height: '50px' }}>
                <LockOpen sx={{ m: 1.5 }} />
              </Box>
            </ListItemIcon>
            <Stack spacing={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                Explicit & sensitive content
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Set this item as explicit and sensitive content
              </Typography>
              <Switch
                checked={explicit}
                onChange={() => {
                  setExplicit(!explicit);
                }}
              />
            </Stack>
          </Stack>
        </>
      )}
      {/* Blockchain */}
      <Typography fontWeight={600} fontSize={24} sx={{ mt: 7 }}>
        Blockchain
      </Typography>
      <Select
        sx={{ my: 3, mt: 3 }}
        value={chain}
        fullWidth
        onChange={handleChain}
        inputProps={{ 'aria-label': 'Without label' }}
        disabled={true}
      >
        <MenuItem value={0}>
          <Box display="flex" alignItems="center">
            <img
              loading="lazy"
              src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png"
              width={24}
              alt="BNB"
            />
            <Typography sx={{ ml: 2 }}>ERC721</Typography>
          </Box>
        </MenuItem>
        <MenuItem value={1}>
          <Box display="flex" alignItems="center">
            <img
              loading="lazy"
              src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png"
              width={24}
              alt="BNB"
            />
            <Typography sx={{ ml: 2 }}>ERC1155</Typography>
          </Box>
        </MenuItem>
      </Select>
      {/* Create Item */}
      <TxButton
        size="large"
        variant="contained"
        sx={{ fontWeight: 800, mt: 7 }}
        onClick={batchMode ? handleCreateBatchItems : handleCreateSingleItem}
        disabled={collections.length === 0}
        loading={isLoading}
      >
        {batchMode ? 'Upload Item' : 'Create Item'}
      </TxButton>
      {requiredEmpty && (
        <Typography color="error" variant="h6" sx={{ mt: 3 }}>
          {requiredEmpty.toUpperCase()}
        </Typography>
      )}
      {creatingError && (
        <Typography color="error" variant="h6" sx={{ mt: 3 }}>
          {creatingError.toUpperCase()}
        </Typography>
      )}
      {collections.length === 0 && (
        <Typography color="error" variant="h6" sx={{ mt: 3 }}>
          You haven&rsquo;t created any collections.
        </Typography>
      )}
      {/* Captcha */}
      <Box sx={{ mt: 3 }}>
        <ReCAPTCHA
          sitekey={SITE_KEY}
          theme="dark"
          onChange={(val) => {
            setCaptcha(val);
          }}
        />
      </Box>

      {/* Dialog */}
      {dialog && (
        <ItemCreateModal
          isOpen={dialog}
          onDismiss={() => setDialog(false)}
          onListforSale={toggleListForSaleModal}
          imageUrl={URL.createObjectURL(imageUrl as File)}
          name={nftItemName}
          collectionId={collections[+collectionIdx]._id}
        />
      )}
      {nftId && collectionId && (
        <ListForSaleModal
          open={isListForSaleModalOpen}
          handleClose={toggleListForSaleModal}
          nftId={nftId}
          collectionId={collectionId}
        />
      )}
    </Container>
  );
};

export default CreateItem;
