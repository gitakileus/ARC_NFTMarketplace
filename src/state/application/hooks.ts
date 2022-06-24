import { useAppDispatch } from '../hooks';
import { setOpenModal } from './actions';
import { ApplicationModal } from './reducer';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAppSelector } from 'state/hooks';
import { AppState } from 'store';

export function useBlockNumber(chainId?: number): number | undefined {
  return useSelector((state: AppState) => state.application.blockNumber[chainId ?? -1]);
}

export function useModalOpen(modal: ApplicationModal): boolean {
  const openModal = useAppSelector((state: AppState) => state.application.openModal);
  return openModal === modal;
}

export function useToggleModal(modal: ApplicationModal): () => void {
  const open = useModalOpen(modal);
  const dispatch = useAppDispatch();
  return useCallback(() => dispatch(setOpenModal(open ? null : modal)), [dispatch, modal, open]);
}

export function useWalletModalToggle(): () => void {
  return useToggleModal(ApplicationModal.WALLET);
}

export function useSearchModalToggle(): () => void {
  return useToggleModal(ApplicationModal.SEARCH);
}

export function useMakeOfferModalToggle(): () => void {
  return useToggleModal(ApplicationModal.MAKE_OFFER);
}

export function useBuyNowModalToggle(): () => void {
  return useToggleModal(ApplicationModal.BUY_NOW);
}

export function useAcceptOfferModalToggle(): () => void {
  return useToggleModal(ApplicationModal.ACCEPT_OFFER);
}

export function useInvalidOfferModalToggle(): () => void {
  return useToggleModal(ApplicationModal.INVALID_OFFER);
}

export function useListForSaleModalToggle(): () => void {
  return useToggleModal(ApplicationModal.LIST_FOR_SALE);
}

export function useCreateItemSuccessModalToggle(): () => void {
  return useToggleModal(ApplicationModal.CREATE_ITEM_SUCCESS);
}

export function useCreateCollectionSuccessModalToggle(): () => void {
  return useToggleModal(ApplicationModal.CREATE_COLLECTION_SUCCESS);
}

export function useCollectionOfferModalToggle(): () => void {
  return useToggleModal(ApplicationModal.COLLECTION_OFFER);
}

export function useCollectionOfferProgressModalToggle(): () => void {
  return useToggleModal(ApplicationModal.COLLECTION_OFFER_PROGRESS);
}

export function useCollectionOfferSuccessModalToggle(): () => void {
  return useToggleModal(ApplicationModal.COLLECTION_OFFER_SUCCESS);
}

export function useProfileModalToggle(): () => void {
  return useToggleModal(ApplicationModal.PROFILE);
}

export function useProfileEditModalToggle(): () => void {
  return useToggleModal(ApplicationModal.PROFILE_EDIT);
}

export function useChooseAvatarModalToggle(): () => void {
  return useToggleModal(ApplicationModal.CHOOSE_AVATAR);
}
