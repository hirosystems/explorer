import { Text } from '@/ui/Text';
import { Flex, Icon } from '@chakra-ui/react';
import { CaretDown, CaretUp, X } from '@phosphor-icons/react';

export const FilterTrigger = ({
  prefix,
  value,
  open,
  setOpen,
  clearFilterHandler,
}: {
  prefix: string;
  value: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  clearFilterHandler: () => void;
}) => {
  return (
    <Flex aria-live="polite" aria-atomic="true" alignItems="center">
      <Flex gap={2}>
        <Flex gap={1} alignItems="center">
          <Text
            textStyle="text-medium-sm"
            color={open ? 'textPrimary' : 'textSecondary'}
            _groupHover={{ color: 'textPrimary' }}
          >
            {prefix}
          </Text>
          {value && (
            <Text textStyle="text-medium-sm" color="textPrimary">
              {value}
            </Text>
          )}
          <Icon
            color={open ? 'iconPrimary' : 'iconSecondary'}
            _groupHover={{ color: 'iconPrimary' }}
            h={3}
            w={3}
          >
            {open ? <CaretUp /> : <CaretDown />}
          </Icon>
        </Flex>
        {value && (
          <Flex
            gap={2}
            alignItems="center"
            className="group"
            onClick={e => {
              e.stopPropagation();
              clearFilterHandler();
            }}
          >
            <Text
              textStyle="text-medium-sm"
              color="textTertiary"
              _groupHover={{ color: 'textPrimary' }}
            >
              |
            </Text>
            <Icon
              h={3}
              w={3}
              color="iconTertiary"
              _groupHover={{ color: 'iconPrimary' }}
              onClick={clearFilterHandler}
            >
              <X />
            </Icon>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
