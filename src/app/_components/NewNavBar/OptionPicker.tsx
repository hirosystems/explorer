import { ResponsiveDesignObject } from '@/ui/types';
import { Flex } from '@chakra-ui/react';
import { useCallback, useState } from 'react';

export type OptionPickerOption = {
  id: string;
  label: string;
  value: string;
  icon: (props: any) => React.ReactNode;
  onSelect?: () => void;
};

export type OptionPickerProps = {
  options: OptionPickerOption[];
  iconButtonHeight?: number | ResponsiveDesignObject;
  iconButtonWidth?: number | ResponsiveDesignObject;
  iconSize?: number | ResponsiveDesignObject;
  defaultOptionId?: string;
  optionId?: string;
  onSelect?: (optionId: string) => void;
};

export const OptionPicker = ({
  options,
  iconSize,
  iconButtonHeight,
  iconButtonWidth,
  defaultOptionId,
  optionId,
  onSelect,
}: OptionPickerProps) => {
  // Internal state for uncontrolled mode
  const [internalSelectedOptionId, setInternalSelectedOptionId] = useState(
    defaultOptionId ?? options[0]?.id
  );

  // Use optionId prop if provided (controlled mode), otherwise use internal state
  const selectedOptionId = optionId ?? internalSelectedOptionId;

  const handleSelect = useCallback(
    (option: OptionPickerOption) => {
      // Call the option's onSelect if provided
      option.onSelect?.();

      // In controlled mode, only call onChange
      if (optionId !== undefined) {
        onSelect?.(option.id);
      } else {
        // In uncontrolled mode, update internal state
        setInternalSelectedOptionId(option.id);
        // Still notify parent if they're interested
        onSelect?.(option.id);
      }
    },
    [optionId, setInternalSelectedOptionId, onSelect]
  );

  return (
    <Flex
      border="1px solid"
      borderColor="redesignBorderSecondary"
      borderRadius="redesign.lg"
      p={1}
      gap={1}
      alignItems="center"
    >
      {options.map(option => (
        <Flex
          key={option.id}
          h={iconButtonHeight}
          w={iconButtonWidth}
          py={1}
          px={2}
          borderRadius="redesign.md"
          bg={option.id === selectedOptionId ? 'surfaceInvert' : 'surfacePrimary'}
          _hover={{
            bg: option.id === selectedOptionId ? 'surfaceInvert' : 'surfaceTertiary',
          }}
          onClick={() => {
            handleSelect(option);
          }}
          className="group"
          alignItems="center"
          justifyContent="center"
        >
          {option.icon({
            h: iconSize ?? 'auto',
            w: iconSize ?? 'auto',
            color: option.id === selectedOptionId ? 'iconInvert' : 'iconSecondary',
            _groupHover: {
              color: option.id === selectedOptionId ? 'iconInvert' : 'surfaceInvert',
            },
          })}
        </Flex>
      ))}
    </Flex>
  );
};
