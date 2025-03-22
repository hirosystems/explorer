import { Field as ChakraField } from '@/components/ui/field';
import { Input } from '@/ui/Input';
import { Stack } from '@chakra-ui/react';
import { UTCDate } from '@date-fns/utc';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import DatePicker from 'react-datepicker';

import { useTxTableFilters } from '../TxTableFilterContext';

type DateFilterMode = 'after' | 'before' | 'between';

interface FormValues {
  startTime: number | null;
  endTime: number | null;
}

interface UnifiedDatePickerProps {
  mode: DateFilterMode;
  defaultStartTime?: number | null;
  defaultEndTime?: number | null;
  onClose?: () => void;
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
    }

    if (mode === 'after' && utcStart) {
      updateDateFilters?.({ startTime: utcStart.toString(), endTime: undefined });
    }

    if (mode === 'between' && utcStart && utcEnd) {
      updateDateFilters?.({ startTime: utcStart.toString(), endTime: utcEnd.toString() });
    }
  };
};

export function UnifiedDatePickerMobile({
  mode,
  defaultStartTime = null,
  defaultEndTime = null,
  onClose,
}: UnifiedDatePickerProps) {
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
      onSubmit={async (values: FormValues) => {
        onClose?.();
      }}
    >
      {() => (
        <Form>
          <Stack gap={4}>
            {mode === 'after' && (
              <Field name="startTime" gap={0}>
                {({ form }: FieldProps<string, FormValues>) => (
                  <ChakraField>
                    <DatePicker
                      customInput={<Input placeholder="Start Date" variant="redesignPrimary" />}
                      selected={
                        form.values.startTime ? new UTCDate(form.values.startTime * 1000) : null
                      }
                      onChange={date => handleDateChange(form, mode, date, null)}
                      dateFormat="yyyy-MM-dd"
                    />
                  </ChakraField>
                )}
              </Field>
            )}

            {mode === 'before' && (
              <Field name="endTime" gap={0}>
                {({ form }: FieldProps<string, FormValues>) => (
                  <ChakraField>
                    <DatePicker
                      customInput={<Input placeholder="YYYY-MM-DD" variant="redesignPrimary" />}
                      selected={
                        form.values.endTime ? new UTCDate(form.values.endTime * 1000) : null
                      }
                      onChange={date => handleDateChange(form, mode, null, date)}
                      dateFormat="yyyy-MM-dd"
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
                      customInput={<Input placeholder="YYYY-MM-DD" variant="redesignPrimary" />}
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
