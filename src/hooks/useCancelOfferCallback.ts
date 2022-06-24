import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { useDeleteActivityMutation } from 'services/activity';

export default function useCancelOfferCallback(sellOfferId: string) {
  const [handleDeleteAcitivy] = useDeleteActivityMutation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  return useCallback(async () => {
    const handleDelete = async () => {
      if (sellOfferId) {
        try {
          // await exchangeContract.cancelMultipleMakerOrders([sellOffer.nonce]);
          const retAcitivityVal = await handleDeleteAcitivy(sellOfferId).unwrap();
          if (retAcitivityVal.code === 200) {
            enqueueSnackbar('Your offer has withdrawn successfully!', {
              variant: 'info',
            });
            window.location.reload();
          }
        } catch (e) {
          enqueueSnackbar('Failed to withdraw offer!', {
            variant: 'info',
          });
          console.log(e);
        }
      }
    };
    await handleDelete();
  }, []);
}
