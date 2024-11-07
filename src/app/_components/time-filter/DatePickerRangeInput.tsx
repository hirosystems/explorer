import { Box, Fieldset, Stack } from '@chakra-ui/react';
import { UTCDate } from '@date-fns/utc';
import { Field, FieldProps, Form, Formik } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { Field as ChakraField } from '../../../components/ui/field';
import { Button } from '../../../ui/Button';
import { DateInput } from './DateInput';

type DateValue = number | undefined;

export interface DatePickerRangeInputState {
  startDate: DateValue;
  endDate: DateValue;
}

interface DatePickerRangeInputProps {
  onSubmit: (values: DatePickerRangeInputState) => void;
  initialStartDate?: DateValue;
  initialEndDate?: DateValue;
  label?: string;
  key?: string;
}

//   // TODO: move this to the search
// function searchDatePickerRangeFormOnSubmitHandler({
//   searchParams,
//   router,
//   onClose,
// }: {
//   searchParams: URLSearchParams;
//   router: ReturnType<typeof useRouter>;
//   onClose: () => void;
// }) {
//   return ({ startTime, endTime }: DateRangeFormValues) => {
//     const params = new URLSearchParams(searchParams);
//     const startTimeTs = startTime ? Math.floor(startTime).toString() : undefined;
//     const endTimeTs = endTime ? Math.floor(endTime).toString() : undefined;
//     if (startTimeTs) {
//       params.set('startTime', startTimeTs);
//     } else {
//       params.delete('startTime');
//     }
//     if (endTimeTs) {
//       params.set('endTime', endTimeTs);
//     } else {
//       params.delete('endTime');
//     }
//     router.push(`?${params.toString()}`, { scroll: false });
//     onClose();
//   };
// }

export function DatePickerRangeInput({
  initialStartDate,
  initialEndDate,
  onSubmit,
  label = 'Between:',
  key,
}: DatePickerRangeInputProps) {
  const initialValues: DatePickerRangeInputState = {
    startDate: initialStartDate,
    endDate: initialEndDate,
  };
  return (
    <Formik
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={initialValues}
      onSubmit={({ startDate, endDate }: DatePickerRangeInputState) => {
        onSubmit({ startDate, endDate });
      }}
      key={key}
    >
      {() => (
        <Form>
          <Stack gap={4}>
            <Field name="startTime">
              {({ form }: FieldProps<string, DatePickerRangeInputState>) => (
                <Fieldset.Root>
                  <ChakraField label={label} />
                  <DatePicker
                    selectsRange={true}
                    customInput={<DateInput placeholder="YYYY-MM-DD" fontSize={'sm'} />}
                    onChange={dateRange => {
                      const [startDate, endDate] = dateRange;
                      const utcStart = startDate
                        ? new UTCDate(
                            startDate.getUTCFullYear(),
                            startDate.getUTCMonth(),
                            startDate.getUTCDate(),
                            0,
                            0,
                            0
                          ).getTime() / 1000
                        : null;
                      const utcEnd = endDate
                        ? new UTCDate(
                            endDate.getUTCFullYear(),
                            endDate.getUTCMonth(),
                            endDate.getUTCDate(),
                            23,
                            59,
                            59
                          ).getTime() / 1000
                        : null;
                      form.setFieldValue('endTime', utcEnd);
                      form.setFieldValue('startTime', utcStart);
                    }}
                    startDate={
                      form.values.startDate ? new UTCDate(form.values.startDate * 1000) : undefined
                    }
                    endDate={
                      form.values.endDate ? new UTCDate(form.values.endDate * 1000) : undefined
                    }
                    dateFormat="yyyy-MM-dd"
                  />
                </Fieldset.Root>
              )}
            </Field>
          </Stack>
          <Box mt={4}>
            <Button
              width="100%"
              type="submit"
              fontSize={'sm'}
              variant={'secondary'}
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
