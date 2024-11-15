'use client';

import { Dialog } from '@chakra-ui/react';
import { FC } from 'react';

import { closeModal } from '../common/components/modals/modal-slice';
import { useAppDispatch } from '../common/state/hooks';
import { Button } from './Button';

export type ModalProps = Omit<CUIModalProps, 'onClose'> & {
  title: string;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  onClose?: () => void;
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
    <Dialog.Root onClose={onClose} {...rest}>
      <Dialog.Backdrop />
      <Dialog.Content pb={'var(--stacks-space-4)'}>
        {title && <Dialog.Header>{title}</Dialog.Header>}
        <Dialog.CloseTrigger />
        <Dialog.Body>{children}</Dialog.Body>
        {!!primaryAction || !!secondaryAction ? (
          <Dialog.Footer>
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
          </Dialog.Footer>
        ) : null}
      </Dialog.Content>
    </Dialog.Root>
  );
};
