import { Field as ChakraField } from '@/components/ui/field';
import { Input } from '@/ui/Input';
import { Stack } from '@chakra-ui/react';
import { UTCDate } from '@date-fns/utc';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import DatePicker from 'react-datepicker';

import { useTxTableFilters } from '../../TxTableFilterContext';
import { DatePickerProps } from './DatePicker';

type DateFilterMode = 'after' | 'before' | 'between';

interface FormValues {
  startTime: number | null;
  endTime: number | null;
}

const useHandleDateChange = () => {
  const { updateDateFilters } = useTxTableFilters() || {};

  return (
    form: FormikProps<FormValues>,
    mode: DateFilterMode,
    startDate: Date | null,
    endDate: Date | null
  ) => {
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

    if (mode === 'before' && utcEnd) {
      updateDateFilters?.({ endTime: utcEnd.toString(), startTime: undefined });
      form.setFieldValue('endTime', utcEnd);
    }

    if (mode === 'after' && utcStart) {
      updateDateFilters?.({ startTime: utcStart.toString(), endTime: undefined });
      form.setFieldValue('startTime', utcStart);
    }

    if (mode === 'between') {
      updateDateFilters?.({ startTime: utcStart?.toString(), endTime: utcEnd?.toString() });
      form.setFieldValue('startTime', utcStart);
      form.setFieldValue('endTime', utcEnd);
    }
  };
};

export function DatePickerMobile({
  mode,
  defaultStartTime = null,
  defaultEndTime = null,
}: DatePickerProps) {
  const initialValues: FormValues = {
    startTime: mode !== 'before' ? defaultStartTime : null,
    endTime: mode !== 'after' ? defaultEndTime : null,
  };
  const handleDateChange = useHandleDateChange();

  return (
    <Formik
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={initialValues}
      onSubmit={() => {}}
    >
      {() => (
        <Form>
          <Stack gap={4}>
            {mode === 'after' && (
              <Field name="startTime" gap={0}>
                {({ form }: FieldProps<string, FormValues>) => (
                  <ChakraField gap={0}>
                    <DatePicker
                      customInput={
                        <Input
                          placeholder="Start Date"
                          variant="redesignPrimary"
                          autoComplete="off"
                        />
                      }
                      selected={
                        form.values.startTime ? new UTCDate(form.values.startTime * 1000) : null
                      }
                      onChange={date => handleDateChange(form, mode, date, null)}
                      dateFormat="yyyy-MM-dd"
                      popperProps={{
                        strategy: 'fixed',
                      }}
                    />
                  </ChakraField>
                )}
              </Field>
            )}

            {mode === 'before' && (
              <Field name="endTime" gap={0}>
                {({ form }: FieldProps<string, FormValues>) => (
                  <ChakraField gap={0}>
                    <DatePicker
                      customInput={
                        <Input
                          placeholder="YYYY-MM-DD"
                          variant="redesignPrimary"
                          autoComplete="off"
                        />
                      }
                      selected={
                        form.values.endTime ? new UTCDate(form.values.endTime * 1000) : null
                      }
                      onChange={date => {
                        handleDateChange(form, mode, null, date);
                      }}
                      dateFormat="yyyy-MM-dd"
                      popperProps={{
                        strategy: 'fixed',
                      }}
                    />
                  </ChakraField>
                )}
              </Field>
            )}

            {mode === 'between' && (
              <Field name="between" gap={0}>
                {({ form }: FieldProps<string, FormValues>) => (
                  <ChakraField gap={0}>
                    <DatePicker
                      selectsRange={true}
                      customInput={
                        <Input
                          placeholder="YYYY-MM-DD"
                          variant="redesignPrimary"
                          autoComplete="off"
                        />
                      }
                      onChange={dateRange => {
                        const [startDate, endDate] = dateRange;
                        handleDateChange(form, mode, startDate, endDate);
                      }}
                      startDate={
                        form.values.startTime
                          ? new UTCDate(form.values.startTime * 1000)
                          : undefined
                      }
                      endDate={
                        form.values.endTime ? new UTCDate(form.values.endTime * 1000) : undefined
                      }
                      dateFormat="yyyy-MM-dd"
                      popperProps={{
                        strategy: 'fixed',
                      }}
                    />
                  </ChakraField>
                )}
              </Field>
            )}
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
