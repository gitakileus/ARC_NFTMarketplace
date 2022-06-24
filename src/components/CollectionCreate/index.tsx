import CollectionSuccessModal from './partials/CollectionSuccessModal';
import { WarningAmber } from '@mui/icons-material';
import { DeleteOutline, FormatListBulleted } from '@mui/icons-material';
import {
  Box,
  Button,
  CardMedia,
  Container,
  Grid,
  InputAdornment,
  ListItemIcon,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import add from 'assets/Icon/add.svg';
import discord from 'assets/Icon/discordGrey.svg';
import instagram from 'assets/Icon/instagramGrey.svg';
import medium from 'assets/Icon/mediumGrey.svg';
import telegram from 'assets/Icon/telegramGrey.svg';
import twitter from 'assets/Icon/twitterGrey.svg';
import world from 'assets/Icon/worldGrey.svg';
import UploadImage from 'components/UploadImage';
import { CATEGORIES } from 'config/categories';
import { INFTCollection } from 'interfaces/INFTCollection';
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { IMaskInput } from 'react-imask';
import { useCreateMutation, useUpdateMutation } from 'services/collection';
import { useGetCollectionsQuery } from 'services/collection';
import { useAppSelector } from 'state/hooks';
import { SITE_KEY } from 'utils';

const StyledBadge = styled('span')(() => ({
  color: `rgb(241, 45, 40)`,
}));

const blockchainList = ['ERC721', 'ERC1155'];

const LinkTextField = ({
  icon,
  placeholder,
  value,
  onChange,
}: {
  icon: string;
  placeholder: string;
  value: string;
  onChange: (e: any) => void;
}) => {
  return (
    <TextField
      fullWidth
      autoFocus
      placeholder={placeholder}
      sx={{ mt: 3 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <CardMedia component="img" image={icon} alt="link" width={24} height={24} />
          </InputAdornment>
        ),
      }}
      value={value}
      onChange={onChange}
    />
  );
};

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props: any, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="https://nft.\arc.m\arket/collections/id"
      blocks={{
        id: {
          // nested masks are available!
          mask: RegExp(/^[a-z0-9-]*$/),
        },
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      lazy={false}
    />
  );
});

interface IProps {
  collection?: INFTCollection;
}

const CollectionCreate = (props: IProps) => {
  const { collection } = props;
  const createOrUpdate = collection ? false : true;
  const [handleCreateHook, { error: errorCreate, isLoading: isLoadingCreatingCollection }] = useCreateMutation();
  const [handleUpdateHook, { error: errorUpdate, isLoading: isLoadingUpdatingCollection }] = useUpdateMutation();
  const { user } = useAppSelector((state) => state.user);
  const { data } = useGetCollectionsQuery();
  const [logoFile, setLogoFile] = useState<File>();
  const [featuredFile, setFeaturedFile] = useState<File>();
  const [bannerFile, setBannerFile] = useState<File>();
  const [name, setName] = useState(collection?.name || '');
  const [url, setUrl] = useState(collection?.url ?? '');
  const [description, setDescription] = useState(collection?.description ?? '');
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [properties, setProperties] = React.useState<Array<string>>([]);
  useEffect(() => {
    if (collection && collection.properties) {
      Object.keys(collection.properties).map((item) => {
        properties.push(item);
        setProperties(properties);
      });
    }
  }, [collection?.properties]);

  const [siteUrl, setSiteUrl] = useState(collection?.links[0] ?? '');
  const [discordUrl, setDiscordUrl] = useState(collection?.links[1] ?? '');
  const [instagramUrl, setInstagramUrl] = useState(collection?.links[2] ?? '');
  const [mediumUrl, setMediumUrl] = useState(collection?.links[3] ?? '');
  const [twitterUrl, setTwitterUrl] = useState(collection?.links[4] ?? '');
  const [telegramUrl, setTelegramUrl] = useState(collection?.links[5] ?? '');
  const [earning, setEarning] = useState(collection?.creatorEarning ?? '');
  const [blockchain, setBlockchain] = useState(collection?.blockchain ?? 'ERC721');
  const [explicit, setExplicit] = useState(collection?.isExplicit ?? false);
  const [collections, setCollections] = useState<INFTCollection[]>([]);

  const [creatingError, setCreatingError] = useState<string>();
  const [success, setSuccess] = useState(false);
  const [createdCollection, setCreatedCollection] = useState<INFTCollection>();
  const [isValid, setIsValid] = useState<boolean>();
  const [isErrorMessage, setIsErrorMessage] = useState<boolean>();
  const [invalidMessage, setInvalidMessage] = useState<string>();
  const [captcha, setCaptcha] = useState<string | null>(null);

  const validatingURL = (inputedUrl: string) => {
    const index = collections.findIndex((collection) => {
      return collection.url === inputedUrl;
    });
    if (index === -1) setIsValid(true);
    else setIsValid(false);
  };

  const handleCollectionCreate = async () => {
    try {
      if (createOrUpdate && logoFile && name && url && isValid && captcha) {
        const body = new FormData();
        body.append('logoFile', logoFile, logoFile.name);
        if (featuredFile) body.append('featuredImgFile', featuredFile, featuredFile.name);
        if (bannerFile) body.append('bannerImgFile', bannerFile, bannerFile.name);

        const propertyJson: any = {};
        properties &&
          properties.map((item: string) => {
            propertyJson[item] = [];
          });
        body.append('creatorId', user.id);
        body.append('name', name);
        body.append('url', url.slice(35));
        body.append('description', description);
        body.append('category', CATEGORIES[categoryIndex]);
        body.append('properties', JSON.stringify(propertyJson));
        body.append('siteUrl', siteUrl);
        body.append('discordUrl', discordUrl);
        body.append('instagramUrl', instagramUrl);
        body.append('mediumUrl', mediumUrl);
        body.append('twitterUrl', twitterUrl);
        body.append('telegramUrl', telegramUrl);
        body.append('creatorEarning', earning);
        body.append('blockchain', blockchain);
        body.append('isExplicit', explicit ? 'true' : 'false');
        const { success, data, status } = await handleCreateHook(body).unwrap();
        if (success) {
          setCreatedCollection(data);
          setSuccess(true);
        } else {
          setCreatingError(status);
          setInvalidMessage('');
        }
      } else if (!createOrUpdate && name && url && isValid && collection && captcha) {
        const body = new FormData();

        const propertyJson: any = {};
        properties &&
          properties.map((item: string) => {
            propertyJson[item] = [];
          });

        if (logoFile) body.append('logoFile', logoFile, logoFile.name);
        if (featuredFile) body.append('featuredImgFile', featuredFile, featuredFile.name);
        if (bannerFile) body.append('bannerImgFile', bannerFile, bannerFile.name);

        if (name !== collection.name) body.append('name', name);
        if (url.slice(35) !== collection.url) body.append('url', url.slice(35));
        if (description !== collection.description) body.append('description', description);
        if (CATEGORIES[categoryIndex] !== collection.category) body.append('category', CATEGORIES[categoryIndex]);
        if (properties !== collection.properties) {
          body.append('properties', JSON.stringify(propertyJson));
        }
        if (siteUrl !== collection.links[0]) body.append('siteUrl', siteUrl);
        if (discordUrl !== collection.links[1]) body.append('discordUrl', discordUrl);
        if (instagramUrl !== collection.links[2]) body.append('instagramUrl', instagramUrl);
        if (mediumUrl !== collection.links[3]) body.append('mediumUrl', mediumUrl);
        if (twitterUrl !== collection.links[4]) body.append('twitterUrl', twitterUrl);
        if (telegramUrl !== collection.links[5]) body.append('telegramUrl', telegramUrl);
        if (earning !== collection.creatorEarning) body.append('creatorEarning', earning);
        if (blockchain !== collection.blockchain) body.append('blockchain', blockchain);
        if (explicit !== collection.isExplicit) body.append('isExplicit', explicit ? 'true' : 'false');

        const { success, data, status } = await handleUpdateHook({ _id: collection?._id, body }).unwrap();
        if (success) {
          setCreatedCollection(data);
          setSuccess(true);
          window.gtag('event', 'nft_collection_created');
        } else {
          setCreatingError(status);
          setInvalidMessage('');
        }
      } else {
        if (!isValid) {
          setIsErrorMessage(true);
          setInvalidMessage('Collection URL is invalid');
        }
        if (!name || !url) {
          setInvalidMessage('Empty name or url');
        }
        if (createOrUpdate && !logoFile) {
          setInvalidMessage('Empty logo');
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    validatingURL(url);
  }, [url]);

  useEffect(() => {
    if (data && Array.isArray(data.data)) {
      const f = data.data;
      setCollections(f);
    }
  }, [data]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // handle input change
  const handleInputChange = (e: any, index: number) => {
    const { value } = e.target;
    const list = [...properties];
    list[index] = value;
    setProperties(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index: number) => {
    const list = [...properties];
    list.splice(index, 1);
    setProperties(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setProperties([...properties, '']);
  };

  const renderProperty = () => {
    if (!_.isEmpty(properties)) {
      return properties.map((x: any, i: number) => (
        <Stack direction="row" alignItems="center" key={i} spacing={2}>
          <TextField name="title" placeholder="eg: character" value={x} onChange={(e) => handleInputChange(e, i)} />
          {properties.length !== 0 && (
            <ListItemIcon onClick={() => handleRemoveClick(i)}>
              <Box sx={{ backgroundColor: '#1E1E1E', borderRadius: 2, width: '50px', height: '50px', my: 2 }}>
                <DeleteOutline sx={{ m: 1.5 }} />
              </Box>
            </ListItemIcon>
          )}
        </Stack>
      ));
    }
  };

  return (
    <Container>
      <Typography variant="h3">{createOrUpdate ? 'Create a' : 'Update your'} collection</Typography>
      <Typography color="text.secondary" mt={2}>
        {createOrUpdate ? 'Create' : 'Update'} and curate an NFT collection on ARC to share and sell your art.
      </Typography>
      {/* Upload Logo */}
      <Grid container alignItems="center" sx={{ mt: 3 }} spacing={5} justifyContent="center">
        <Grid item sm={12} md={5} textAlign="center" order={{ xs: 2, sm: 2, md: 1 }}>
          <UploadImage
            id="CollectionCreateLogo"
            width={320}
            height={320}
            rounded
            fit
            title="Upload 320 x 320"
            imageFile={logoFile}
            setImageFile={setLogoFile}
            imageUrl={collection?.logoUrl}
          />
        </Grid>
        <Grid item sm={12} md={7} order={{ xs: 1, sm: 1, md: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Logo image<StyledBadge> *</StyledBadge>
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" mt={1}>
            The logo will be displayed on the collection&#39;s profile. Supported files include: JPG, PNG.
          </Typography>
        </Grid>
      </Grid>
      {/* Upload Image */}
      <Grid container alignItems="center" sx={{ mt: 3 }} spacing={5}>
        <Grid item sm={12} md={5} textAlign="center" order={{ xs: 2, sm: 2, md: 1 }}>
          <UploadImage
            id="CollectionCreateImage"
            width={360}
            height={300}
            title="Upload 600 x 400"
            imageFile={featuredFile}
            setImageFile={setFeaturedFile}
            imageUrl={collection?.featuredUrl}
          />
        </Grid>
        <Grid item sm={12} md={7} order={{ xs: 1, sm: 1, md: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Featured image
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" mt={1}>
            This image will be used for featuring your collection on the homepage, category pages or other promotional
            areas.
          </Typography>
        </Grid>
      </Grid>
      {/* Banner Image */}
      <Box mt={7}>
        <Typography variant="subtitle1" fontWeight={600}>
          Banner image
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" mt={1}>
          This image will appear at the top of your collection page. Avoid including too much text on the banner as the
          dimensions will change on different devices.
        </Typography>
        <Box textAlign="center" mt={3}>
          <UploadImage
            id="CollectionCreateBanner"
            width={'100%'}
            height={300}
            title="Upload 1440 x 400"
            imageFile={bannerFile}
            setImageFile={setBannerFile}
            imageUrl={collection?.bannerUrl}
          />
        </Box>
      </Box>
      {/* NFT Name */}
      <Box mt={7}>
        <Typography variant="subtitle1" fontWeight={600}>
          Collection name<StyledBadge> *</StyledBadge>
        </Typography>
        {createOrUpdate ? (
          <TextField
            fullWidth
            autoFocus
            placeholder="Enter name"
            sx={{ mt: 3 }}
            value={name}
            onChange={(e) => setName(e.target.value.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase()))}
          />
        ) : (
          <TextField fullWidth autoFocus placeholder="Enter name" sx={{ mt: 3 }} value={name} disabled />
        )}
      </Box>
      {/* URL */}
      <Box mt={7}>
        <Typography variant="subtitle1" fontWeight={600}>
          URL<StyledBadge> *</StyledBadge>
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" mt={1}>
          Customize your collection&#39;s URL on ARC. Only lowercase characters, numbers and hyphens are supported.
        </Typography>
        <Box>
          <OutlinedInput
            fullWidth
            sx={{ mt: 3 }}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            inputComponent={TextMaskCustom}
          />
        </Box>
        {isErrorMessage && (
          <Typography variant="subtitle2" color="#f12d28" mt={1}>
            This Url is invalid.
          </Typography>
        )}
      </Box>
      {/* Description */}
      <Box mt={7}>
        <Typography variant="subtitle1" fontWeight={600}>
          Description
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" mt={1}>
          This description will be visible to prospective buyers on the collection page. Maximum 1000 words.
        </Typography>
        <TextField
          multiline
          fullWidth
          autoFocus
          rows={3}
          placeholder="Provide details about your collection"
          sx={{ mt: 3 }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Box>
      {/* Category */}
      <Box mt={7}>
        <Typography variant="subtitle1" fontWeight={600} mt={1}>
          Category
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          You can select just one category, this groups the collection with other collections with the same category and
          makes it easy to find
        </Typography>
        <Select
          sx={{ mt: 3 }}
          value={categoryIndex}
          fullWidth
          onChange={(e) => setCategoryIndex(+e.target.value)}
          inputProps={{ 'aria-label': 'Without label' }}
        >
          {CATEGORIES.map((category, index: number) => (
            <MenuItem value={index} autoFocus key={index}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </Box>
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
          {/* Add Property */}
          {renderProperty()}
          <Stack
            sx={{ color: '#007AFF', cursor: 'pointer' }}
            direction="row"
            alignItems="center"
            spacing={1}
            onClick={handleAddClick}
          >
            <CardMedia
              component="img"
              image={add}
              alt="add"
              sx={{ width: '14px', height: '14px', borderRadius: '100%' }}
            />
            <Typography variant="subtitle2" fontWeight={600}>
              Add Property
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      {/* Links */}
      <Box mt={7}>
        <Typography variant="subtitle1" fontWeight={600}>
          Links
        </Typography>
        <LinkTextField
          icon={world}
          placeholder="https://yoursite.com"
          value={siteUrl}
          onChange={(e) => setSiteUrl(e.target.value)}
        />
        <LinkTextField
          icon={discord}
          placeholder="https://www.discord.gg/"
          value={discordUrl}
          onChange={(e) => setDiscordUrl(e.target.value)}
        />
        <LinkTextField
          icon={instagram}
          placeholder="https://www.instagram.com/"
          value={instagramUrl}
          onChange={(e) => setInstagramUrl(e.target.value)}
        />
        <LinkTextField
          icon={medium}
          placeholder="https://www.medium.com/"
          value={mediumUrl}
          onChange={(e) => setMediumUrl(e.target.value)}
        />
        <LinkTextField
          icon={twitter}
          placeholder="https://www.twitter.com/"
          value={twitterUrl}
          onChange={(e) => setTwitterUrl(e.target.value)}
        />
        <LinkTextField
          icon={telegram}
          placeholder="https://t.me/"
          value={telegramUrl}
          onChange={(e) => setTelegramUrl(e.target.value)}
        />
      </Box>
      <Box mt={7}>
        <Typography variant="subtitle1" fontWeight={600}>
          Creator&#39;s earnings
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" mt={1}>
          Collect a percentage fee when a user re-sells an item that you originally created. This fee is deducted from
          the final sale price and paid to your wallet address upon execution of a successful sale. Eg. 2.5 = 2.5% of
          the final sale price.
        </Typography>
        <TextField
          fullWidth
          placeholder="e.g 2.5"
          sx={{ mt: 3 }}
          value={earning}
          onChange={(e) => setEarning(e.target.value)}
        />
      </Box>
      {/* Blockchain */}
      {createOrUpdate ? (
        <Box mt={7}>
          <Typography variant="subtitle1" fontWeight={600}>
            Blockchain
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" mt={1}>
            Select the type of NFT items you want to list within this collection.
          </Typography>
          <Select
            sx={{ mt: 3 }}
            value={blockchain}
            fullWidth
            onChange={(e) => setBlockchain(e.target.value)}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            {blockchainList.map((item) => (
              <MenuItem value={item} key={item}>
                <Box display="flex" alignItems="center">
                  <img
                    loading="lazy"
                    src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png"
                    width={24}
                    alt="ETH"
                  />
                  <Typography sx={{ ml: 2 }}>{item}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </Box>
      ) : (
        <Box mt={7}>
          <Typography variant="subtitle1" fontWeight={600}>
            Blockchain
          </Typography>
          <Select sx={{ mt: 3 }} value={blockchain} fullWidth disabled inputProps={{ 'aria-label': 'Without label' }}>
            {blockchainList.map((item) => (
              <MenuItem value={item} key={item}>
                <Box display="flex" alignItems="center">
                  <img
                    loading="lazy"
                    src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png"
                    width={24}
                    alt="ETH"
                  />
                  <Typography sx={{ ml: 2 }}>{item}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}
      {/* Explicit & Sensitive Content */}
      <Stack direction="row" spacing={3} mt={7}>
        <ListItemIcon>
          <Box
            sx={{
              backgroundColor: '#1e1e1e',
              border: '1px solid #2c2c2c',
              borderRadius: '10px',
              width: '50px',
              height: '50px',
            }}
          >
            <WarningAmber sx={{ m: 1.5 }} />
          </Box>
        </ListItemIcon>
        <Stack spacing={1}>
          <Typography variant="subtitle1" fontWeight={600}>
            Explicit & Sensitive Content
          </Typography>
          <Typography variant="subtitle2" color="textSecondary" mt={1}>
            Set this collection as explicit and/or sensitive content
          </Typography>
          <Switch
            checked={explicit}
            onChange={(e) => {
              setExplicit(e.target.checked);
            }}
          />
        </Stack>
      </Stack>
      {/* Create Collection */}
      <Button
        size="large"
        variant="contained"
        sx={{ fontWeight: 800, width: { xs: '100%', sm: '220px' }, mt: 7, px: 0 }}
        onClick={handleCollectionCreate}
      >
        {createOrUpdate ? 'Create' : 'Update'} collection
      </Button>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoadingCreatingCollection || isLoadingUpdatingCollection}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {creatingError && (
        <Typography color="error" variant="h6" sx={{ mt: 3 }}>
          {creatingError}!
        </Typography>
      )}
      {invalidMessage && (
        <Typography color="error" variant="h6" sx={{ mt: 3 }}>
          {invalidMessage}!
        </Typography>
      )}
      {createdCollection && (
        <CollectionSuccessModal
          isOpen={success}
          collection={createdCollection}
          onDismiss={() => {
            setSuccess(false);
            window.location.reload();
          }}
          createOrUpdate={createOrUpdate}
        />
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
    </Container>
  );
};

export default CollectionCreate;
