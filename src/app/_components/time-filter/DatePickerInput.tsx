import { FormLabel } from '@/ui/FormLabel';
import { UTCDate } from '@date-fns/utc';
import { Field, FieldProps, Form, Formik } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { Box } from '../../../ui/Box';
import { Button } from '../../../ui/Button';
import { FormControl } from '../../../ui/FormControl';
import { Stack } from '../../../ui/Stack';
import { DateInput } from './DateInput';

type DateValue = number | undefined;

export interface DatePickerValues {
  date: DateValue;
}

export interface DatePickerFormProps {
  initialDate: DateValue;
  onSubmit: (values: DatePickerValues) => void;
  placeholder?: string;
  label?: string;
  key?: string;
}

// TODO: move this to the search
// function searchAfterDatePickerOnSubmitHandler({
//   searchParams,
//   router,
//   onClose,
// }: {
//   searchParams: URLSearchParams;
//   router: ReturnType<typeof useRouter>;
//   onClose: () => void;
// }) {
//   return ({ date: startTime }: DatePickerFormValues) => {
//     const params = new URLSearchParams(searchParams);
//     const startTimeTs = startTime ? Math.floor(startTime).toString() : undefined;
//     params.delete('endTime');
//     if (startTimeTs) {
//       params.set('startTime', startTimeTs);
//     } else {
//       params.delete('startTime');
//     }
//     router.push(`?${params.toString()}`, { scroll: false });
//     onClose();
//   };
// }

// TODO: move this to the search
// function searchBeforeDatePickerOnSubmitHandler({
//   searchParams,
//   router,
//   onClose,
// }: {
//   searchParams: URLSearchParams;
//   router: ReturnType<typeof useRouter>;
//   onClose: () => void;
// }) {
//   return ({ date: endTime }: DatePickerFormValues) => {
//     const params = new URLSearchParams(searchParams);
//     const endTimeTs = endTime ? Math.floor(endTime).toString() : undefined;
//     params.delete('startTime');
//     if (endTimeTs) {
//       params.set('endTime', endTimeTs);
//     } else {
//       params.delete('endTime');
//     }
//     router.push(`?${params.toString()}`, { scroll: false });
//     onClose();
//   };
// }

export function DatePickerInput({
  initialDate,
  label = 'Date:',
  onSubmit,
  placeholder = 'YYYY-MM-DD',
  key,
}: DatePickerFormProps) {
  const initialValues: DatePickerValues = {
    date: initialDate,
  };
  return (
    <Formik
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={initialValues}
      onSubmit={({ date }: DatePickerValues) => {
        onSubmit({ date });
      }}
      key={key}
    >
      {() => (
        <Form>
          <Stack gap={4}>
            <Field name="date">
              {({ field, form }: FieldProps<string, DatePickerValues>) => (
                <FormControl>
                  <FormLabel>{label}</FormLabel>
                  <DatePicker
                    customInput={<DateInput placeholder={placeholder} fontSize="sm" />}
                    selected={form.values.date ? new UTCDate(form.values.date * 1000) : undefined}
                    onChange={date => {
                      if (date) {
                        const utcDate = new UTCDate(
                          date.getUTCFullYear(),
                          date.getUTCMonth(),
                          date.getUTCDate(),
                          0,
                          0,
                          0
                        );
                        form.setFieldValue('date', utcDate.getTime() / 1000);
                      }
                    }}
                    dateFormat="yyyy-MM-dd"
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
