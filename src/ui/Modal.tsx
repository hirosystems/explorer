'use client';

import { useAppDispatch } from '@/common/state/hooks';
import { closeModal } from '@/components/modals/modal-slice';
import { Button } from '@/ui/components';
import {
  Modal as CUIModal,
  ModalProps as CUIModalProps,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { FC } from 'react';

export type ModalProps = Omit<CUIModalProps, 'onClose'> & {
  title: string;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
};
export const Modal: FC<ModalProps> = ({
  children,
  primaryAction,
  secondaryAction,
  title,
  ...rest
}) => {
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
};
