import { modalState } from '@store/recoil/modals';
import { AllModals, MODALS } from '@common/constants';
import { useAtom } from 'jotai';
import { useNetwork } from '@common/hooks/use-network';

export const useModal = () => {
  const [modal, setModal] = useAtom<AllModals | null, AllModals | null>(modalState);
  const { isSwitching } = useNetwork();
  const setOpenModal = (slug: AllModals) => setModal(slug);
  const handleCloseModal = () => setModal(null);

  const handleOpenSearchModal = () => {
    setOpenModal(MODALS.SEARCH);
  };
  const handleOpenNetworkModal = () => {
    setOpenModal(MODALS.NETWORK);
  };
  const handleOpenDifferentNetworkModal = () => {
    if (isSwitching) return;
    setOpenModal(MODALS.DIFFERENT_NETWORK);
  };
  const handleOpenUnlockingScheduleModal = () => {
    setOpenModal(MODALS.UNLOCKING_SCHEDULE);
  };
  return {
    modal,
    setModal,
    setOpenModal,
    handleCloseModal,
    handleOpenSearchModal,
    handleOpenNetworkModal,
    handleOpenDifferentNetworkModal,
    handleOpenUnlockingScheduleModal,
  };
};
