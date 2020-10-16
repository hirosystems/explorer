import * as React from 'react';
import { Box, BoxProps } from '@stacks/ui';

import { RowsProps } from '@components/rows/types';
import { RowLabel, Row } from '@components/rows/row';
import { Card } from '@components/card';

export const Rows: React.FC<RowsProps & BoxProps> = ({
  card,
  childComponent,
  items,
  columnLabels,
  inline,
  noTopBorder,
  ...props
}) => {
  const Component = card ? Card : Box;
  const ChildComponent = childComponent || Row;
  return (
    <Component width="100%" {...(props as any)}>
      {columnLabels?.length ? (
        <Row
          py="tight"
          borderBottom="0"
          label={{ children: columnLabels[0] }}
          render={columnLabels[1] ? <RowLabel label={columnLabels[1]} /> : undefined}
        />
      ) : null}
      {items.map(({ label, children, copy, condition = true }, key, arr) => {
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
            isLast={key === arr.filter(a => a).length - 1}
          />
        ) : null;
      })}
    </Component>
  );
};
