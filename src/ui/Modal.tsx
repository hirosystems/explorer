import {
  Modal as CUIModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps as CUIModalProps,
} from '@chakra-ui/react';
import { useAppDispatch } from '@/common/state/hooks';
import { closeModal } from '@/components/modals/modal-slice';
import { Button } from '@/ui/components';

export type ModalProps = Omit<CUIModalProps, 'onClose'> & {
  title: string;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
};
export function Modal({ children, primaryAction, secondaryAction, title, ...rest }: ModalProps) {
  const dispatch = useAppDispatch();
  const onClose = () => {
    dispatch(closeModal());
  };
  return (
    <CUIModal onClose={onClose} {...rest}>
      <ModalOverlay />
      <ModalContent>
        {title && <ModalHeader>{title}</ModalHeader>}
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          {primaryAction && (
            <Button colorScheme="blue" mr={3} onClick={primaryAction.onClick}>
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="ghost" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </CUIModal>
  );
}
