'use client';

import { ButtonProps } from '@/ui/Button';
import type { HTMLChakraProps, TextProps } from '@chakra-ui/react';
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
import { useMemo } from 'react';

import { Text } from '../../ui/Text';
import { LinkButton } from './link-button';

interface ButtonVariantContext {
  size: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  getHref?: (page: number) => string;
}

const [RootPropsProvider, useRootProps] = createContext<ButtonVariantContext>({
  name: 'RootPropsProvider',
});

export interface PaginationRootProps extends Omit<ChakraPagination.RootProps, 'type'> {
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  getHref?: (page: number) => string;
}

export const PaginationRoot = React.forwardRef<HTMLDivElement, PaginationRootProps>(
  function PaginationRoot(props, ref) {
    const { size, variant, getHref, ...rest } = props;
    return (
      <RootPropsProvider value={{ size, variant, getHref }}>
        <ChakraPagination.Root ref={ref} type={getHref ? 'link' : 'button'} {...rest} />
      </RootPropsProvider>
    );
  }
);

export const PaginationEllipsis = React.forwardRef<HTMLDivElement, ChakraPagination.EllipsisProps>(
  function PaginationEllipsis(props, ref) {
    return (
      <ChakraPagination.Ellipsis ref={ref} {...props} asChild>
        <Button as="span" bg="transparent" cursor="default">
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
    const { getHref } = useRootProps();

    const current = page === props.value;

    if (getHref) {
      return <LinkButton href={getHref(props.value)}>{props.value}</LinkButton>;
    }

    return (
      <ChakraPagination.Item ref={ref} {...props} asChild>
        <Button className="group" bg={current ? 'surfacePrimary' : 'transparent'}>
          <Text
            textStyle="text-medium-xs"
            color={current ? 'textPrimary' : 'textTertiary'}
            _groupHover={{ color: 'textPrimary' }}
            borderRadius="sm"
            fontVariantNumeric="tabular-nums"
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
  const { getHref } = useRootProps();
  const { previousPage } = usePaginationContext();
  const isDisabled = previousPage === null;

  if (getHref) {
    return (
      <LinkButton href={previousPage != null ? getHref(previousPage) : undefined}>
        <Icon
          h={4}
          w={4}
          color={previousPage ? 'iconInvert' : 'var(--stacks-colors-neutral-sand-400)'}
        >
          <CaretLeft />
        </Icon>{' '}
      </LinkButton>
    );
  }

  return (
    <ChakraPagination.PrevTrigger ref={ref} asChild>
      <Button
        className="previous-trigger"
        {...props}
        bg={
          isDisabled
            ? {
                base: 'var(--stacks-colors-neutral-sand-150)',
                _dark: 'var(--stacks-colors-neutral-sand-900',
              }
            : 'surfaceInvert'
        }
        _hover={{
          bg: isDisabled
            ? {
                base: 'var(--stacks-colors-neutral-sand-150)',
                _dark: 'var(--stacks-colors-neutral-sand-900',
              }
            : {
                base: 'var(--stacks-colors-neutral-sand-1000)',
                _dark: 'var(--stacks-colors-neutral-white)',
              },
        }}
        borderRadius="sm"
        disabled={false}
      >
        <Icon
          h={4}
          w={4}
          color={isDisabled ? 'var(--stacks-colors-neutral-sand-400)' : 'iconInvert'}
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
  const { getHref } = useRootProps();
  const { nextPage } = usePaginationContext();
  const isDisabled = nextPage === null;

  if (getHref) {
    return (
      <LinkButton href={nextPage != null ? getHref(nextPage) : undefined}>
        <Icon h={4} w={4} color={nextPage ? 'iconInvert' : 'var(--stacks-colors-neutral-sand-400)'}>
          <CaretRight />
        </Icon>{' '}
      </LinkButton>
    );
  }

  return (
    <ChakraPagination.NextTrigger ref={ref} asChild>
      <Button
        className="next-trigger"
        {...props}
        bg={
          isDisabled
            ? {
                base: 'var(--stacks-colors-neutral-sand-150)',
                _dark: 'var(--stacks-colors-neutral-sand-900',
              }
            : 'surfaceInvert'
        }
        _hover={{
          bg: nextPage
            ? {
                base: 'var(--stacks-colors-neutral-sand-1000)',
                _dark: 'var(--stacks-colors-neutral-white)',
              }
            : {
                base: 'var(--stacks-colors-neutral-sand-150)',
                _dark: 'var(--stacks-colors-neutral-sand-900',
              },
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

// This should be exported from Chakra UI
type Pages = Array<
  | {
      type: 'ellipsis';
    }
  | {
      type: 'page';
      value: number;
    }
>;

export const PaginationItems = (props: PaginationItemsProps) => {
  const { ellipsisProps, itemProps, ...commonProps } = props;

  const renderPaginationItems = React.useCallback(
    ({
      pages,
      page: currentPage,
      totalPages,
    }: {
      pages: Pages;
      page: number;
      totalPages: number;
    }) => {
      if (totalPages <= 5) {
        let lastPage: { type: 'page'; value: number };
        return pages.map((page, index) => {
          if (page.type !== 'ellipsis') {
            const item = (
              <PaginationItem
                key={index}
                type="page"
                value={page.value}
                aria-current={page.value === currentPage ? 'page' : undefined}
                aria-label={`Page ${page.value}`}
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
                aria-label={`Page ${lastPage.value + 1}`}
                {...commonProps}
                {...(itemProps || {})}
              />
            );
          }
        });
      }
      if (totalPages > 99) {
        return pages.slice(0, -1).map((page, index) => {
          return page.type === 'ellipsis' ? (
            <PaginationEllipsis
              key={index}
              index={index}
              aria-hidden="true"
              aria-label="More pages"
              {...commonProps}
              {...ellipsisProps}
            />
          ) : (
            <PaginationItem
              key={index}
              type="page"
              value={page.value}
              aria-current={page.value === currentPage ? 'page' : undefined}
              aria-label={`Page ${page.value}`}
              {...commonProps}
              {...(itemProps || {})}
            />
          );
        });
      }

      return pages.map((page, index) => {
        return page.type === 'ellipsis' ? (
          <PaginationEllipsis
            key={index}
            index={index}
            aria-hidden="true"
            aria-label="More pages"
            {...commonProps}
            {...ellipsisProps}
          />
        ) : (
          <PaginationItem
            key={index}
            type="page"
            value={page.value}
            aria-current={page.value === currentPage ? 'page' : undefined}
            aria-label={`Page ${page.value}`}
            {...commonProps}
            {...(itemProps || {})}
          />
        );
      });
    },
    [commonProps, ellipsisProps, itemProps]
  );

  const contextProps = usePaginationContext();

  const paginationItems = useMemo(
    () => renderPaginationItems(contextProps),
    [renderPaginationItems, contextProps]
  );

  return <>{paginationItems}</>;

  // return (
  //   // @ts-ignore
  //   <ChakraPagination.Context>
  //     {({ pages, totalPages }) => {
  //       if (totalPages <= 5) {
  //         let lastPage: { type: 'page'; value: number };
  //         return pages.map((page, index) => {
  //           if (page.type !== 'ellipsis') {
  //             const item = (
  //               <PaginationItem
  //                 key={index}
  //                 type="page"
  //                 value={page.value}
  //                 {...commonProps}
  //                 {...(itemProps || {})}
  //               />
  //             );
  //             lastPage = page;
  //             return item;
  //           } else {
  //             return (
  //               <PaginationItem
  //                 key={index}
  //                 type="page"
  //                 value={lastPage.value + 1}
  //                 {...commonProps}
  //                 {...(itemProps || {})}
  //               />
  //             );
  //           }
  //         });
  //       }
  //       if (totalPages > 99) {
  //         return pages.slice(0, -1).map((page, index) => {
  //           return page.type === 'ellipsis' ? (
  //             <PaginationEllipsis key={index} index={index} {...commonProps} {...ellipsisProps} />
  //           ) : (
  //             <PaginationItem
  //               key={index}
  //               type="page"
  //               value={page.value}
  //               {...commonProps}
  //               {...(itemProps || {})}
  //             />
  //           );
  //         });
  //       }
  //       return pages.map((page, index) => {
  //         return page.type === 'ellipsis' ? (
  //           <PaginationEllipsis key={index} index={index} {...commonProps} {...ellipsisProps} />
  //         ) : (
  //           <PaginationItem
  //             key={index}
  //             type="page"
  //             value={page.value}
  //             {...commonProps}
  //             {...(itemProps || {})}
  //           />
  //         );
  //       });
  //     }}
  //   </ChakraPagination.Context>
  // );
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

// This should be exported from Chakra UI
export interface PageChangeDetails {
  page: number;
  pageSize: number;
}
