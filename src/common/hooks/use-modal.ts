import { useRecoilState } from 'recoil';
import { modalState } from '@store/modals';
import { AllModals, MODALS } from '@common/constants';

export const useModal = () => {
  const [modal, setModal] = useRecoilState<AllModals | null>(modalState);

  const setOpenModal = (slug: AllModals) => setModal(slug);
  const handleCloseModal = () => setModal(null);

  const handleOpenSearchModal = () => {
    setOpenModal(MODALS.SEARCH);
  };
  const handleOpenNetworkModal = () => {
    setOpenModal(MODALS.NETWORK);
  };
  const handleOpenDifferentNetworkModal = () => {
    setOpenModal(MODALS.DIFFERENT_NETWORK);
  };
  return {
    modal,
    setModal,
    setOpenModal,
    handleCloseModal,
    handleOpenSearchModal,
    handleOpenNetworkModal,
    handleOpenDifferentNetworkModal,
  };
};
