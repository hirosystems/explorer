import { Text } from '@/ui/Text';
import { Header } from '@tanstack/react-table';

export const DefaultTableColumnHeader = <TData, TValue>({
  header,
  children,
}: {
  header: Header<TData, TValue>;
  children: React.ReactNode;
}) => {
  return (
    <Text
      textStyle="text-medium-sm"
      color="textSecondary"
      whiteSpace="nowrap"
      textTransform="none"
      letterSpacing="normal"
      fontFamily="instrument"
      css={{
        '& .column-header-content:hover': {
          color: 'textPrimary',
        },
      }}
      {...(header.column.getCanSort() && {
        _groupHover: {
          color: 'textPrimary',
        },
      })}
    >
      {children}
    </Text>
  );
};
