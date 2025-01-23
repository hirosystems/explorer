'use client';

import { Dialog, DialogRootProps, Icon } from '@chakra-ui/react';
import { X } from '@phosphor-icons/react';
import { FC } from 'react';

import { closeModal } from '../common/components/modals/modal-slice';
import { useAppDispatch } from '../common/state/hooks';
import { DialogContent } from '../components/ui/dialog';
import { Button } from './Button';

export type ModalProps = Omit<DialogRootProps, 'children'> & {
  title: React.ReactNode;
  body: React.ReactNode;
  trigger?: React.ReactNode;
};

export const RedesignModal: FC<ModalProps> = ({ open, title, body, trigger, ...rest }) => {
  const dispatch = useAppDispatch();
  const onClose = () => {
    dispatch(closeModal());
  };
  return (
    <Dialog.Root
      open={open}
      closeOnInteractOutside={true}
      {...rest}
      placement="center"
      variant="redesignPrimary"
    >
      {trigger && <Dialog.Trigger>{trigger}</Dialog.Trigger>}
      <Dialog.Backdrop />
      <DialogContent>
        <Dialog.CloseTrigger w="full" display="flex" justifyContent="flex-end" alignItems="center">
          <Button onClick={onClose} variant="wrapper">
            <Icon h={5} w={5} color="iconPrimary">
              <X />
            </Icon>
          </Button>
        </Dialog.CloseTrigger>
        <Dialog.Header p={0} mb={3}>
          <Dialog.Title>{title}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>{body}</Dialog.Body>
      </DialogContent>
    </Dialog.Root>
  );
};
