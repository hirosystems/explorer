import { Box, Fieldset, Stack } from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';

import { Field as ChakraField } from '../../../components/ui/field';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';

type Time = number | string | undefined;

export interface TimeRangeInputState {
  startTime: Time;
  endTime: Time;
}

interface DateInputRangeFormProps {
  initialStartTime: Time;
  initialEndTime: Time;
  onSubmit: (values: TimeRangeInputState) => void;
  startPlaceholder?: string;
  startLabel?: string;
  endPlaceholder?: string;
  endLabel?: string;
  type: 'number' | 'text';
}

export function TimeRangeInput({
  initialStartTime,
  initialEndTime,
  startLabel = 'From:',
  onSubmit,
  startPlaceholder = '',
  endPlaceholder = '',
  endLabel = 'To:',
  type,
}: DateInputRangeFormProps) {
  const initialValues: TimeRangeInputState = {
    startTime: initialStartTime,
    endTime: initialEndTime,
  };
  return (
    <Formik
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={initialValues}
      onSubmit={({ startTime, endTime }: TimeRangeInputState) => {
        onSubmit({ startTime, endTime });
      }}
    >
      {({ values, handleChange }) => (
        <Form>
          <Stack gap={4}>
            <Field name="start">
              {({ field, form }: FieldProps<string, TimeRangeInputState>) => (
                <Fieldset.Root>
                  <ChakraField label={startLabel} />
                  <Input
                    {...field}
                    value={values.startTime || ''}
                    onChange={handleChange}
                    placeholder={startPlaceholder}
                    type={type}
                  />
                </Fieldset.Root>
              )}
            </Field>
            <Field name="end">
              {({ field, form }: FieldProps<string, TimeRangeInputState>) => (
                <Fieldset.Root>
                  <ChakraField label={endLabel} />
                  <Input
                    {...field}
                    value={values.endTime || ''}
                    onChange={handleChange}
                    placeholder={endPlaceholder}
                    type={type}
                  />
                </Fieldset.Root>
              )}
            </Field>
          </Stack>
          <Box mt={4}>
            <Button
              width="full"
              type="submit"
              fontSize="sm"
              variant="secondary"
              height={10}
              color="textSubdued"
            >
              Apply
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
