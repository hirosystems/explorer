import { Box, Fieldset, Stack } from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';

import { Field as ChakraField } from '../../../components/ui/field';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';

export type Time = string;

export interface TimeInputState {
  time: Time;
}

interface TimeInputProps {
  initialTime?: Time;
  onSubmit: (values: TimeInputState) => void;
  placeholder?: string;
  label: string;
  type: 'number' | 'text';
}

export function TimeInput({
  initialTime = '',
  label,
  onSubmit,
  placeholder = '',
  type,
}: TimeInputProps) {
  const initialValues: TimeInputState = {
    time: initialTime,
  };
  return (
    <Formik
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={initialValues}
      onSubmit={(values: TimeInputState, { resetForm }) => {
        onSubmit(values);
        resetForm();
      }}
    >
      {({ values, handleChange }) => (
        <Form>
          <Stack gap={4}>
            <Field name="time">
              {({ field, form }: FieldProps<string, TimeInputState>) => (
                <Fieldset.Root>
                  <ChakraField label={label} />
                  <Input
                    {...field}
                    value={values.time || ''}
                    onChange={handleChange}
                    placeholder={placeholder}
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
