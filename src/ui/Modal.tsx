'use client';

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

import { closeModal } from '../common/components/modals/modal-slice';
import { useAppDispatch } from '../common/state/hooks';
import { Button } from './Button';

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
      <ModalContent pb={'var(--stacks-space-4)'}>
        {title && <ModalHeader>{title}</ModalHeader>}
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        {!!primaryAction || !!secondaryAction ? (
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
        ) : null}
      </ModalContent>
    </CUIModal>
  );
};
