import { Text } from '@/ui/Text';
import { Flex, FlexProps, Icon } from '@chakra-ui/react';
import { CaretDown, CaretUp, X } from '@phosphor-icons/react';

export type FilterTriggerContainerProps = FlexProps | ((open: boolean) => FlexProps);

export const FilterTrigger = ({
  prefix,
  value,
  open,
  setOpen,
  clearFilterHandler,
  containerProps,
}: {
  prefix: string;
  value: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  clearFilterHandler: () => void;
  containerProps?: FilterTriggerContainerProps;
}) => {
  const cp = typeof containerProps === 'function' ? containerProps(open) : containerProps;

  return (
    <Flex
      className="filter-trigger"
      aria-live="polite"
      aria-atomic="true"
      alignItems="center"
      role="button"
      aria-haspopup="dialog"
      aria-expanded={open}
      {...cp}
      px={0}
      py={0}
    >
      <Flex
        className="open-close-trigger-area group"
        gap={1}
        justifyContent="space-between"
        alignItems="center"
        onClick={e => {
          e.stopPropagation();
          setOpen(!open);
        }}
        pl={cp?.px ?? 0}
        pr={value ? 2 : (cp?.px ?? 0)}
        py={cp?.py ?? 0}
        cursor="pointer"
        w="full"
      >
        <Flex gap={1}>
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
        </Flex>
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
          pr={cp?.px ?? 0}
          py={cp?.py ?? 0}
          alignItems="center"
          className="clear-trigger-area group"
          onClick={e => {
            e.stopPropagation();
            clearFilterHandler();
          }}
          cursor="pointer"
        >
          <Text textStyle="text-medium-sm" color="textTertiary">
            |
          </Text>
          <Icon
            pl={2}
            h={3}
            w={3}
            boxSizing={'content-box'}
            color="iconTertiary"
            _groupHover={{ color: 'iconPrimary' }}
            onClick={clearFilterHandler}
          >
            <X />
          </Icon>
        </Flex>
      )}
    </Flex>
  );
};
