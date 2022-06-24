import InvalidModal from './InvalidModal';
import { Close } from '@mui/icons-material';
import { Button, CardMedia, Divider, IconButton, Modal, Stack, Typography } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import { styled } from '@mui/material/styles';
import { MaxUint256 } from '@uniswap/sdk-core';
import ether from 'assets/Icon/ether.svg';
import TxButton from 'components/TxButton';
import {
  STRATEGY_STANDARD_SALE_FOR_FIXED_PRICE_ADDRESS,
  STRATEGY_ANY_ITEM_FROM_COLLECTION_FOR_FIXED_PRICE_ADDRESS,
  WETH_ADDRESS,
  ARC721_ADDRESS,
  EXCHANGE_ADDRESS,
  TRANSFER_MANAGER_ERC721_ADDRESS,
} from 'constants/addresses';
import { BigNumber, Contract, ethers } from 'ethers';
import { useExchangeContract, useERC20TokenContract, useARC721Contract } from 'hooks/useContract';
import useFetchEthPrice from 'hooks/useFetchEthPrice';
import { INFT } from 'interfaces/INFT';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useDeleteActivityMutation, useApproveItemOfferMutation } from 'services/activity';
import { useGetItemQuery, useGetOffersQuery } from 'services/item';
import { useInvalidOfferModalToggle, useModalOpen } from 'state/application/hooks';
import { ApplicationModal } from 'state/application/reducer';
import { numberWithCommas } from 'utils';
import signMakeOrder from 'utils/signMakeOrder';
import { useWeb3 } from 'web3';

const StyledProfileModal = styled('div')(() => ({
  position: 'absolute',
  backgroundColor: '#1E1E1E',
  borderRadius: '10px',
  width: '580px',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '40px',
}));

interface IProps {
  open: boolean;
  handleClose: () => void;
  offer: any;
}
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AccpetOfferModal(props: IProps) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [handleApproveItemOffer] = useApproveItemOfferMutation();
  const { open, handleClose, offer } = props;
  const { data: itemResponse } = useGetItemQuery({ contract: offer?.collectionId, index: offer?.nftId });
  const [item, setItem] = useState<INFT | null>(null);
  const [accepting, setAccepting] = useState<boolean>(false);
  const exchangeContract = useExchangeContract();
  const { provider, chainId, account } = useWeb3();

  const ethPrice = useFetchEthPrice();
  const token721Contract = useARC721Contract();

  React.useEffect(() => {
    if (itemResponse && itemResponse.success) {
      setItem(itemResponse.data);
    }
  }, [itemResponse, offer]);

  const handleApprove = async () => {
    if (chainId && token721Contract && account && offer && item) {
      setAccepting(true);
      if (item.mintStatus === 'Lazy Minted') {
        await handleAccept();
      } else {
        try {
          const res = await token721Contract.ownerOf(BigNumber.from(offer.nftId));
          const approved = await token721Contract.isApprovedForAll(account, TRANSFER_MANAGER_ERC721_ADDRESS[chainId]);
          if (res === account) {
            if (!approved) {
              await token721Contract.approve(TRANSFER_MANAGER_ERC721_ADDRESS[chainId], BigNumber.from(offer.nftId));
            }
            await handleAccept();
          }
        } catch (e) {
          console.log(e);
        }
      }
      setAccepting(false);
    }
  };
  const handleAccept = async () => {
    if (exchangeContract && provider && chainId && account && item) {
      const key = enqueueSnackbar('Accepting Offer...', {
        persist: true,
        variant: 'info',
      });
      try {
        const takeOrder = {
          isOrderAsk: true,
          taker: account,
          price: ethers.utils.parseEther(offer.price.toString()),
          tokenId: offer.nftId,
          minPercentageToAsk: 9000,
          params: [],
        };
        const makeOrder = {
          isOrderAsk: false,
          signer: offer.from,
          collection: ARC721_ADDRESS[chainId], //offer.collection,
          price: ethers.utils.parseEther(offer.price.toString()),
          tokenId: offer.type === 'OfferCollection' ? 0 : offer.nftId,
          amount: 1,
          strategy:
            offer.type === 'OfferCollection'
              ? STRATEGY_ANY_ITEM_FROM_COLLECTION_FOR_FIXED_PRICE_ADDRESS[chainId]
              : STRATEGY_STANDARD_SALE_FOR_FIXED_PRICE_ADDRESS[chainId],
          currency: WETH_ADDRESS[chainId],
          nonce: offer.nonce,
          startTime: Math.floor(offer.startDate / 1000),
          endTime: Math.floor(offer.endDate / 1000),
          minPercentageToAsk: 9000,
          params: [],
          r: offer.signature.r,
          s: offer.signature.s,
          v: offer.signature.v,
        };
        const transactionResponse = await exchangeContract.matchBidWithTakerAsk(takeOrder, makeOrder);
        const receipt = await transactionResponse.wait(); //wait till transaction is minded

        if (receipt.status) {
          const retUpdateVal = await handleApproveItemOffer({
            collectionId: item.collectionId,
            nftId: item.index,
            seller: item.owner,
            buyer: offer.from,
            activityId: offer._id,
          }).unwrap();

          closeSnackbar(key);

          if (retUpdateVal.code === 200) {
            enqueueSnackbar('You accepted offer successfully!', {
              variant: 'info',
            });
            window.gtag('event', 'nft_offer_accepted');
            handleClose();
            window.location.reload();
          } else {
            enqueueSnackbar('Something went wrong with your accept!', {
              variant: 'info',
            });
          }
        } else {
          closeSnackbar(key);
          enqueueSnackbar('Your transaction is failed', {
            variant: 'info',
          });
        }
      } catch (e) {
        console.log(e);
        closeSnackbar(key);

        enqueueSnackbar(
          'Sorry, it looks like the person who made this offer doesn’t have enough WETH balance to pay for it. If they top up their balance, you may be able to accept it later',
          {
            variant: 'info',
          }
        );
      }
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <StyledProfileModal>
          <IconButton onClick={handleClose} sx={{ position: 'absolute', top: '30px', right: '30px' }}>
            <Close />
          </IconButton>
          <Typography variant="subtitle1" mb={4}>
            Accept offer
          </Typography>
          <Stack direction="column" spacing={2} divider={<Divider orientation="horizontal" flexItem />}>
            <Stack direction="row" justifyContent="space-between">
              <Typography>Offer</Typography>
              <Stack direction="column">
                <Stack direction="row" spacing={2} alignItems="center">
                  <CardMedia component="img" image={ether} alt="ether" sx={{ width: 10, height: 20 }} />
                  <Typography>{offer.price}</Typography>
                </Stack>
                {ethPrice && (
                  <Typography variant="body2" textAlign="right" color="textSecondary">
                    ${numberWithCommas(ethPrice * +offer.price)}
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography>Fees</Typography>
              <Stack direction="column">
                <Typography>Creator: 2%</Typography>
                <Typography variant="caption" color="textSecondary" textAlign="right">
                  ARC: {offer.fee}%
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle1">You receive</Typography>
              <Stack direction="column">
                <Stack direction="row" spacing={2} alignItems="center">
                  <CardMedia component="img" image={ether} alt="ether" sx={{ width: 10, height: 20 }} />
                  <Typography variant="subtitle1">{offer.price}</Typography>
                </Stack>
                {ethPrice && (
                  <Typography variant="caption" color="textSecondary" textAlign="right">
                    ${numberWithCommas(ethPrice * +offer.price)}
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Stack>
          <TxButton
            variant="contained"
            color="secondary"
            sx={{ width: '100%', paddingY: '14px', marginTop: '40px' }}
            onClick={handleApprove}
            loading={accepting}
          >
            Accept offer
          </TxButton>
        </StyledProfileModal>
      </Modal>
    </>
  );
}
