'use client';

import type { ButtonProps, HTMLChakraProps, TextProps } from '@chakra-ui/react';
import {
  Button,
  Pagination as ChakraPagination,
  Icon,
  Stack,
  createContext,
  usePaginationContext,
} from '@chakra-ui/react';
import { CaretLeft, CaretRight, DotsThree } from '@phosphor-icons/react';
import * as React from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

import { Text } from '../../ui/Text';
import { LinkButton } from './link-button';

interface ButtonVariantMap {
  current: ButtonProps['variant'];
  default: ButtonProps['variant'];
  ellipsis: ButtonProps['variant'];
}

type PaginationVariant = 'outline' | 'solid' | 'subtle';

interface ButtonVariantContext {
  size: ButtonProps['size'];
  variantMap: ButtonVariantMap;
  getHref?: (page: number) => string;
}

const [RootPropsProvider, useRootProps] = createContext<ButtonVariantContext>({
  name: 'RootPropsProvider',
});

export interface PaginationRootProps extends Omit<ChakraPagination.RootProps, 'type'> {
  size?: ButtonProps['size'];
  variant?: PaginationVariant;
  getHref?: (page: number) => string;
}

// TODO: probably don't want to use this
const variantMap: Record<PaginationVariant, ButtonVariantMap> = {
  outline: { default: 'ghost', ellipsis: 'plain', current: 'outline' },
  solid: { default: 'outline', ellipsis: 'outline', current: 'solid' },
  subtle: { default: 'ghost', ellipsis: 'plain', current: 'subtle' },
};

export const PaginationRoot = React.forwardRef<HTMLDivElement, PaginationRootProps>(
  function PaginationRoot(props, ref) {
    const { size = 'sm', variant = 'outline', getHref, ...rest } = props;
    return (
      <RootPropsProvider value={{ size, variantMap: variantMap[variant], getHref }}>
        <ChakraPagination.Root ref={ref} type={getHref ? 'link' : 'button'} {...rest} />
      </RootPropsProvider>
    );
  }
);

export const PaginationEllipsis = React.forwardRef<HTMLDivElement, ChakraPagination.EllipsisProps>(
  function PaginationEllipsis(props, ref) {
    return (
      <ChakraPagination.Ellipsis ref={ref} {...props} asChild>
        <Button as="span" minW={8} bg="transparent" cursor="default">
          <Stack position="relative" h={4} w={4}>
            <Icon color="textTertiary" h={4} w={4} bottom={-1} position="absolute" left={0}>
              <DotsThree />
            </Icon>
          </Stack>
        </Button>
      </ChakraPagination.Ellipsis>
    );
  }
);

export const PaginationItem = React.forwardRef<HTMLButtonElement, ChakraPagination.ItemProps>(
  function PaginationItem(props, ref) {
    const { page } = usePaginationContext();
    const { size, variantMap, getHref } = useRootProps();

    const current = page === props.value;
    const variant = current ? variantMap.current : variantMap.default;

    if (getHref) {
      return (
        <LinkButton href={getHref(props.value)} variant={variant} size={size}>
          {props.value}
        </LinkButton>
      );
    }

    return (
      <ChakraPagination.Item ref={ref} {...props} asChild>
        <Button role="group" bg={current ? 'surfacePrimary' : 'transparent'}>
          <Text
            fontSize="xs"
            fontWeight="medium"
            color={current ? 'textPrimary' : 'textTertiary'}
            _groupHover={{ color: 'textPrimary' }}
            borderRadius="sm"
          >
            {props.value}
          </Text>
        </Button>
      </ChakraPagination.Item>
    );
  }
);

export const PaginationPrevTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraPagination.PrevTriggerProps
>(function PaginationPrevTrigger(props, ref) {
  const { size, variantMap, getHref } = useRootProps();
  const { previousPage } = usePaginationContext();

  if (getHref) {
    return (
      <LinkButton
        href={previousPage != null ? getHref(previousPage) : undefined}
        variant={variantMap.default}
        size={size}
      >
        <HiChevronLeft />
      </LinkButton>
    );
  }

  return (
    <ChakraPagination.PrevTrigger ref={ref} asChild {...props}>
      <Button
        bg={previousPage ? 'surfaceInvert' : 'var(--stacks-colors-neutral-sand-150)'}
        _hover={{
          bg: previousPage
            ? {
                base: 'var(--stacks-colors-neutral-sand-1000)',
                _dark: 'var(--stacks-colors-neutral-white)',
              }
            : 'var(--stacks-colors-neutral-sand-150)',
        }}
      >
        <Icon
          h={4}
          w={4}
          color={previousPage ? 'iconInvert' : 'var(--stacks-colors-neutral-sand-400)'}
        >
          <CaretLeft />
        </Icon>
      </Button>
    </ChakraPagination.PrevTrigger>
  );
});

export const PaginationNextTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraPagination.NextTriggerProps
>(function PaginationNextTrigger(props, ref) {
  const { size, variantMap, getHref } = useRootProps();
  const { nextPage } = usePaginationContext();

  if (getHref) {
    return (
      <LinkButton
        href={nextPage != null ? getHref(nextPage) : undefined}
        variant={variantMap.default}
        size={size}
      >
        <HiChevronRight />
      </LinkButton>
    );
  }

  return (
    <ChakraPagination.NextTrigger ref={ref} asChild {...props}>
      <Button
        bg={nextPage ? 'surfaceInvert' : 'var(--stacks-colors-neutral-sand-150)'}
        _hover={{
          bg: nextPage
            ? {
                base: 'var(--stacks-colors-neutral-sand-1000)',
                _dark: 'var(--stacks-colors-neutral-white)',
              }
            : 'var(--stacks-colors-neutral-sand-150)',
        }}
      >
        <Icon h={4} w={4} color={nextPage ? 'iconInvert' : 'var(--stacks-colors-neutral-sand-400)'}>
          <CaretRight />
        </Icon>
      </Button>
    </ChakraPagination.NextTrigger>
  );
});

export interface PaginationItemsProps extends React.HTMLAttributes<HTMLElement> {
  ellipsisProps?: HTMLChakraProps<'div'>;
  itemProps?: Omit<HTMLChakraProps<'button'>, 'type' | 'value'>;
}

export const PaginationItems = (props: PaginationItemsProps) => {
  const { ellipsisProps, itemProps, ...commonProps } = props;
  return (
    // @ts-ignore
    <ChakraPagination.Context>
      {({ pages }) => {
        if (pages.length <= 5) {
          let lastPage: { type: 'page'; value: number };
          return pages.map((page, index) => {
            if (page.type !== 'ellipsis') {
              const item = (
                <PaginationItem
                  key={index}
                  type="page"
                  value={page.value}
                  {...commonProps}
                  {...(itemProps || {})}
                />
              );
              lastPage = page;
              return item;
            } else {
              return (
                <PaginationItem
                  key={index}
                  type="page"
                  value={lastPage.value + 1}
                  {...commonProps}
                  {...(itemProps || {})}
                />
              );
            }
          });
        }
        return pages.map((page, index) => {
          return page.type === 'ellipsis' ? (
            <PaginationEllipsis key={index} index={index} {...commonProps} {...ellipsisProps} />
          ) : (
            <PaginationItem
              key={index}
              type="page"
              value={page.value}
              {...commonProps}
              {...(itemProps || {})}
            />
          );
        });
      }}
    </ChakraPagination.Context>
  );
};

interface PageTextProps extends TextProps {
  format?: 'short' | 'compact' | 'long';
}

export const PaginationPageText = React.forwardRef<HTMLParagraphElement, PageTextProps>(
  function PaginationPageText(props, ref) {
    const { format = 'compact', ...rest } = props;
    const { page, totalPages, pageRange, count } = usePaginationContext();
    const content = React.useMemo(() => {
      if (format === 'short') return `${page} / ${totalPages}`;
      if (format === 'compact') return `${page} of ${totalPages}`;
      return `${pageRange.start + 1} - ${pageRange.end} of ${count}`;
    }, [format, page, totalPages, pageRange, count]);

    return (
      <Text fontWeight="medium" ref={ref} {...rest}>
        {content}
      </Text>
    );
  }
);

export interface PageChangeDetails {
  // This should be exported from Chakra UI
  page: number;
  pageSize: number;
}
