import * as React from 'react';
import { Box, BoxProps } from '@stacks/ui';

import { RowsProps } from '@components/rows/types';
import { RowLabel, Row } from '@components/rows/row';
import { Card } from '@components/card';

export const Rows: React.FC<RowsProps & BoxProps> = React.memo(
  ({
    card,
    childComponent,
    items,
    columnLabels,
    inline,
    noTopBorder,
    noBottomBorder,
    alignItems = inline ? 'unset' : ['unset', 'unset', 'center'],
    ...props
  }) => {
    const Component = card ? Card : Box;
    const ChildComponent: any = childComponent || Row;
    return (
      <Component width="100%" {...(props as any)}>
        {columnLabels?.length ? (
          <Row
            py="tight"
            borderBottom="0"
            label={{ children: columnLabels[0] }}
            render={columnLabels[1] ? <RowLabel label={columnLabels[1]} /> : undefined}
            alignItems={alignItems}
          />
        ) : null}
        {items
          .filter(a => a.condition !== false)
          .map(({ label, children, copy, condition = true, ...rowProps }, key, arr) => {
            return condition ? (
              <ChildComponent
                key={key}
                card={card}
                copy={copy}
                label={label}
                inline={inline}
                render={children}
                isFirst={key === 0}
                noTopBorder={noTopBorder}
                isLast={key === arr.length - 1}
                alignItems={alignItems as any}
                {...rowProps}
              />
            ) : null;
          })}
      </Component>
    );
  }
);
