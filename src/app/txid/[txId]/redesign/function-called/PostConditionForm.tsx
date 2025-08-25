import { Select } from '@/common/components/Select';
import { Input } from '@/ui/Input';
import { Caption } from '@/ui/typography';
import { Box, Field, Stack } from '@chakra-ui/react';
import { FormikErrors } from 'formik';
import { useMemo } from 'react';

import { PostConditionMode } from '@stacks/transactions';

import { FormikSetFieldValueFunction, FunctionFormikState } from './FunctionCallForm';
import {
  PostConditionConditionCodeLabel,
  PostConditionConditionCodeValue,
  PostConditionConditionCodeValueMapReversed,
  PostConditionTypeLabel,
  PostConditionTypeOptions,
  PostConditionTypeValue,
  PostConditionTypeValueMapReversed,
  getPostConditionConditionCodeOptions,
  postConditionParameterLabels,
  postConditionParameterMap,
} from './post-condition-utils';

export function PostConditionForm({
  values,
  errors,
  formikSetFieldValue,
  handleChange,
}: {
  values: FunctionFormikState;
  errors: FormikErrors<FunctionFormikState>;
  formikSetFieldValue: FormikSetFieldValueFunction;
  handleChange: any;
}) {
  const postConditionConditionCodeOptions = useMemo(() => {
    return values.postConditionType != null
      ? getPostConditionConditionCodeOptions(values.postConditionType)
      : [];
  }, [values.postConditionType]);

  const postConditionTypeParameters = useMemo(() => {
    return values.postConditionType != null
      ? postConditionParameterMap[values.postConditionType]
      : [];
  }, [values.postConditionType]);

  return (
    <>
      {values.postConditionMode === PostConditionMode.Deny && (
        <Stack gap={4}>
          <Stack gap={2}>
            <Select<PostConditionTypeValue, PostConditionTypeLabel>
              placeholder="Post-condition type"
              items={PostConditionTypeOptions}
              onValueChange={details => {
                const postConditionTypeValue = details
                  .value[0] as unknown as PostConditionTypeValue;
                formikSetFieldValue(
                  'postConditionType',
                  PostConditionTypeValueMapReversed[postConditionTypeValue]
                );
              }}
              size="sm"
            />
            {errors && (
              <Caption color="textError" textStyle="text-medium-xs">
                {errors.postConditionType}
              </Caption>
            )}
          </Stack>
          {postConditionTypeParameters.length > 0 && (
            <Stack gap={4}>
              {postConditionTypeParameters.map(parameter => (
                <Box key={parameter}>
                  {parameter !== 'postConditionMode' &&
                  parameter !== 'postConditionType' &&
                  parameter !== 'postConditionConditionCode' ? (
                    <Stack gap={2}>
                      <Field.Root invalid={!!errors[parameter]}>
                        <Field.Label
                          textStyle="text-regular-sm"
                          color={errors[parameter] ? 'textError' : 'textSecondary'}
                        >
                          {postConditionParameterLabels[parameter]}
                        </Field.Label>
                        <Input
                          variant="redesignPrimary"
                          width="full"
                          type={parameter === 'postConditionAmount' ? 'number' : 'text'}
                          name={parameter}
                          id={parameter}
                          onChange={handleChange}
                        />
                        <Field.ErrorText color="textError" textStyle="text-medium-xs">
                          {errors[parameter]}
                        </Field.ErrorText>
                      </Field.Root>
                    </Stack>
                  ) : (
                    <Stack gap={2}>
                      <Select<PostConditionConditionCodeValue, PostConditionConditionCodeLabel>
                        placeholder="Condition code"
                        items={postConditionConditionCodeOptions}
                        onValueChange={details => {
                          const postConditionConditionCodeValue = details
                            .value[0] as unknown as PostConditionConditionCodeValue;
                          formikSetFieldValue(
                            'postConditionConditionCode',
                            PostConditionConditionCodeValueMapReversed[
                              postConditionConditionCodeValue
                            ]
                          );
                        }}
                        size="sm"
                      />
                      {errors.postConditionConditionCode && (
                        <Caption color="textError" textStyle="text-medium-xs">
                          {errors.postConditionConditionCode}
                        </Caption>
                      )}
                    </Stack>
                  )}
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
      )}
    </>
  );
}
