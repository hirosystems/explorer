import { IconAlertTriangle } from '@tabler/icons';
import React from 'react';

import { Box, Button, Flex, Input, Stack, StackProps, color } from '@stacks/ui';

import { useNetworkAddForm } from '@common/hooks/use-network-add-form';

import { Caption } from '@components/typography';

export const AddNetworkForm: React.FC<StackProps> = props => {
  const { handleSubmit, handleChange, errors, isValidating } = useNetworkAddForm();
  return (
    <Stack spacing="loose" as="form" onSubmit={handleSubmit} {...props}>
      <Stack spacing="base" px="extra-loose">
        <Stack>
          <Caption htmlFor="label" as="label">
            Name
          </Caption>
          <Input
            autoFocus
            name="label"
            id="label"
            placeholder="My Stacks API"
            onChange={handleChange}
            color={color('text-body')}
          />
          {errors?.label && <Caption color={color('feedback-error')}>{errors?.label}</Caption>}
        </Stack>
        <Stack>
          <Caption htmlFor="url" as="label">
            URL
          </Caption>
          <Input
            id="url"
            name="url"
            type="url"
            placeholder="https://"
            onChange={handleChange}
            color={color('text-body')}
          />
          {errors?.url && <Caption color={color('feedback-error')}>{errors?.url}</Caption>}
        </Stack>
      </Stack>
      {(errors as any).general && (
        <Flex alignItems="center" pb="tight" px="extra-loose">
          <Box
            size="22px"
            strokeWidth={1.5}
            color={color('feedback-error')}
            as={IconAlertTriangle}
            mr="tight"
          />
          <Caption color={color('feedback-error')}>{(errors as any).general}</Caption>
        </Flex>
      )}
      <Box px="extra-loose" pb="extra-loose">
        <Button isLoading={isValidating} width="100%" onClick={handleSubmit}>
          Add and select
        </Button>
      </Box>
    </Stack>
  );
};
