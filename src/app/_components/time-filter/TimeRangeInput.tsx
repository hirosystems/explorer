import { FormLabel } from '@/ui/FormLabel';
import { Input } from '@/ui/Input';
import { Field, FieldProps, Form, Formik } from 'formik';

import { Box } from '../../../ui/Box';
import { Button } from '../../../ui/Button';
import { FormControl } from '../../../ui/FormControl';
import { Stack } from '../../../ui/Stack';

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
                <FormControl>
                  <FormLabel>{startLabel}</FormLabel>
                  <Input
                    {...field}
                    value={values.startTime || ''}
                    onChange={handleChange}
                    placeholder={startPlaceholder}
                    type={type}
                  />
                </FormControl>
              )}
            </Field>
            <Field name="end">
              {({ field, form }: FieldProps<string, TimeRangeInputState>) => (
                <FormControl>
                  <FormLabel>{endLabel}</FormLabel>
                  <Input
                    {...field}
                    value={values.endTime || ''}
                    onChange={handleChange}
                    placeholder={endPlaceholder}
                    type={type}
                  />
                </FormControl>
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
