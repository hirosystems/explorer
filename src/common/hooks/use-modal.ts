import { useRecoilState } from 'recoil';
import { modalState } from '@store/modals';

export const useModal = () => {
  const [modal, setModal] = useRecoilState<string | null>(modalState);

  const setOpenModal = (slug: string) => setModal(slug);
  const handleCloseModal = () => setModal(null);

  return {
    modal,
    setModal,
    setOpenModal,
    handleCloseModal,
  };
};
