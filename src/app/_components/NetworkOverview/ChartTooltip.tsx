import { useColorMode } from '@/components/ui/color-mode';
import { Text } from '@/ui/Text';
import { Stack } from '@chakra-ui/react';
import { TooltipProps } from 'recharts';

export function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  const { colorMode } = useColorMode();

  if (active && payload && payload.length) {
    const dataPoint = payload[0]?.payload;
    const dateObj = dataPoint?.date as Date;
    let formattedDate = label;

    if (dateObj instanceof Date) {
      const timeFormat = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      const dateFormat = new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

      formattedDate = `${timeFormat.format(dateObj)}, ${dateFormat.format(dateObj)}`;
    }

    return (
      <Stack
        bg={
          colorMode === 'light'
            ? 'var(--stacks-colors-alpha-black-alpha-700)'
            : 'var(--stacks-colors-alpha-sand-alpha-400)'
        }
        px={2}
        pt={1.5}
        pb={2.5}
        borderRadius="redesign.sm"
        borderColor="borderPrimary"
        gap={2.5}
      >
        <Text
          textStyle={'text-medium-xs'}
          color={
            colorMode === 'light'
              ? 'var(--stacks-colors-neutral-sand-200)'
              : 'var(--stacks-colors-neutral-sand-300)'
          }
        >
          {formattedDate}
        </Text>
        <Text
          textStyle={'text-mono-md'}
          color={
            colorMode === 'light'
              ? 'var(--stacks-colors-neutral-sand-50)'
              : 'var(--stacks-colors-neutral-sand-100)'
          }
        >
          {payload[0].value?.toLocaleString()}
        </Text>
      </Stack>
    );
  }
  return null;
}
