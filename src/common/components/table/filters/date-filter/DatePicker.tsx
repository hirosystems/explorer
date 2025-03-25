import { Field as ChakraField } from '@/components/ui/field';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Stack } from '@chakra-ui/react';
import { UTCDate } from '@date-fns/utc';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactDatePicker from 'react-datepicker';

type DateFilterMode = 'after' | 'before' | 'between';

interface FormValues {
  startTime: number | null;
  endTime: number | null;
}

export interface DatePickerProps {
  mode: DateFilterMode;
  defaultStartTime?: number | null;
  defaultEndTime?: number | null;
  onSubmit?: () => void;
}

const handleDateChange = (
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
    form.setFieldValue('endTime', utcEnd);
  }

  if (mode === 'after' && utcStart) {
    form.setFieldValue('startTime', utcStart);
  }

  if (mode === 'between') {
    form.setFieldValue('endTime', utcEnd);
    form.setFieldValue('startTime', utcStart);
  }
};

export const getDateFilterParams = (
  params: URLSearchParams,
  startTime: number | null,
  endTime: number | null
) => {
  const startTimeTs = startTime ? Math.floor(startTime).toString() : undefined;
  const endTimeTs = endTime ? Math.floor(endTime).toString() : undefined;
  const mode = startTime && endTime ? 'between' : startTime ? 'after' : 'before';

  if (mode === 'before') {
    if (endTimeTs) {
      params.set('endTime', endTimeTs);
    } else {
      params.delete('endTime');
    }
    params.delete('startTime');
    return params;
  }
  if (mode === 'after') {
    if (startTimeTs) {
      params.set('startTime', startTimeTs);
    } else {
      params.delete('startTime');
    }
    params.delete('endTime');
    return params;
  }
  if (mode === 'between') {
    if (startTimeTs) {
      params.set('startTime', startTimeTs);
    } else {
      params.delete('startTime');
    }
    if (endTimeTs) {
      params.set('endTime', endTimeTs);
    } else {
      params.delete('endTime');
    }
    return params;
  }
  return params;
};

export const useDateFilterSubmitHandler = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  return async ({ startTime, endTime }: FormValues) => {
    const params = new URLSearchParams(searchParams);
    const paramsWithDateFilter = getDateFilterParams(params, startTime, endTime);
    router.push(`?${paramsWithDateFilter.toString()}`, { scroll: false });
  };
};

export function DatePicker({
  mode,
  defaultStartTime = null,
  defaultEndTime = null,
  onSubmit,
}: DatePickerProps) {
  const initialValues: FormValues = {
    startTime: mode !== 'before' ? defaultStartTime : null,
    endTime: mode !== 'after' ? defaultEndTime : null,
  };
  const handleSubmit = useDateFilterSubmitHandler();

  return (
    <Formik
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={initialValues}
      onSubmit={async (values: FormValues) => {
        handleSubmit?.(values);
        onSubmit?.();
      }}
    >
      {() => (
        <Form>
          <Stack gap={4}>
            {mode === 'after' && (
              <Field name="startTime" gap={0}>
                {({ form }: FieldProps<string, FormValues>) => (
                  <ChakraField>
                    <ReactDatePicker
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
                  <ChakraField>
                    <ReactDatePicker
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
                      onChange={date => handleDateChange(form, mode, null, date)}
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
                    <ReactDatePicker
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
            <Button width="100%" type="submit" size="small" variant="redesignSecondary">
              Apply
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
