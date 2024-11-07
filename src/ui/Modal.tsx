'use client';

import { DialogRootProps } from '@chakra-ui/react';
import { FC } from 'react';

import { closeModal } from '../common/components/modals/modal-slice';
import { useAppDispatch } from '../common/state/hooks';
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Button } from './Button';

export type ModalProps = Omit<DialogRootProps, 'children'> & {
  title: React.ReactNode;
  body: React.ReactNode;
  trigger?: React.ReactNode;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  onClose?: () => void;
};
export const Modal: FC<ModalProps> = ({
  open,
  title,
  body,
  trigger,
  primaryAction,
  secondaryAction,
  ...rest
}) => {
  const dispatch = useAppDispatch();
  const onClose = () => {
    dispatch(closeModal());
  };
  return (
    <DialogRoot open={open} closeOnInteractOutside={true} {...rest}>
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogBackdrop />
      <DialogContent>
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogCloseTrigger onClick={onClose} />
          </DialogHeader>
        )}
        <DialogBody>{body}</DialogBody>
        {!!primaryAction || !!secondaryAction ? (
          <DialogFooter>
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
          </DialogFooter>
        ) : null}
      </DialogContent>
    </DialogRoot>
  );
};
