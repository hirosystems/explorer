import { Button } from '@/ui/Button';
import { Icon } from '@/ui/Icon';
import React from 'react';
import { HiMiniArrowUpRight } from 'react-icons/hi2';

export function Footer() {
  return (
    <Button
      width={'100%'}
      backgroundColor={'#fff'}
      color={'#242629'}
      fontWeight={500}
      borderWidth={'1px'}
      _hover={{
        backgroundColor: '#F9F9FA',
      }}
    >
      View all recent blocks <Icon as={HiMiniArrowUpRight} width={'16px'} height={'16px'} />
    </Button>
  );
}
