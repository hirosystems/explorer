import { Field as ChakraField } from '@/components/ui/field';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Text } from '@/ui/Text';
import { Flex, Icon, Stack } from '@chakra-ui/react';
import { UTCDate } from '@date-fns/utc';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactDatePicker from 'react-datepicker';

export type DatePickerMode = 'after' | 'before' | 'between';

const DATE_PICKER_WIDTH = '240px';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DATE_PICKER_CSS = {
  '& .react-datepicker__day-names': {
    display: 'flex',
    margin: 0,
  },
  '& .react-datepicker__day-name': {
    color: 'textTertiary',
    textStyle: 'text-medium-xs',
    h: 8,
    w: 9,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  '& .react-datepicker__header': {
    backgroundColor: 'surfaceTertiary',
    border: 'none',
    pt: 2,
    px: 2,
    pb: 0,
  },
  '& .react-datepicker-wrapper, .react-datepicker__input-container': {
    width: 'full',
  },
  '& .react-datepicker__month': {
    backgroundColor: 'surfaceTertiary',
    margin: 0,
    px: 2,
    pb: 2,
    pt: 0,
  },
  '& .react-datepicker__week': {
    display: 'flex',
  },
  '& .react-datepicker__day': {
    color: 'textPrimary',
    textStyle: 'text-medium-xs',
    h: 8,
    w: 9,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    _hover: {
      backgroundColor: 'surfacePrimary',
    },
    borderRadius: 'redesign.md',
  },

  '& .react-datepicker__day--selected, & .react-datepicker__day--keyboard-selected, & .react-datepicker__day--in-range, & .react-datepicker__day--in-selecting-range':
    {
      backgroundColor: 'surfaceInvert !important',
      color: 'textInvert !important',
    },
};

const DatePickerCustomHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
}: {
  date: Date;
  decreaseMonth: () => void;
  increaseMonth: () => void;
}) => (
  <Flex justifyContent="space-between" alignItems="center" fontFamily="var(--font-instrument-sans)">
    <Icon
      onClick={decreaseMonth}
      cursor="pointer"
      aria-role="button"
      aria-label="Decrease month"
      h={4}
      w={4}
      color="iconPrimary"
      _groupHover={{ color: 'iconPrimary' }}
    >
      <ArrowLeft />
    </Icon>
    <Flex alignItems="center" gap={1}>
      <Text textStyle="text-medium-sm">{MONTHS[date.getMonth()]}</Text>
      <Text textStyle="text-medium-sm">{date.getFullYear()}</Text>
    </Flex>

    <Icon
      onClick={increaseMonth}
      cursor="pointer"
      aria-role="button"
      aria-label="Increase month"
      h={4}
      w={4}
      color="iconPrimary"
      _groupHover={{ color: 'iconPrimary' }}
    >
      <ArrowRight />
    </Icon>
  </Flex>
);

interface FormValues {
  startTime: number | null;
  endTime: number | null;
}

export interface DatePickerProps {
  mode: DatePickerMode;
  defaultStartTime?: number | null;
  defaultEndTime?: number | null;
  onSubmit?: () => void;
}

const handleDateChange = (
  form: FormikProps<FormValues>,
  mode: DatePickerMode,
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
          <Stack gap={4} css={DATE_PICKER_CSS}>
            {mode === 'after' && (
              <Field name="startTime" gap={0}>
                {({ form }: FieldProps<string, FormValues>) => (
                  <ChakraField gap={0} css={DATE_PICKER_CSS}>
                    <ReactDatePicker
                      customInput={
                        <Input
                          aria-label="Start date input"
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
                      renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                        <DatePickerCustomHeader
                          date={date}
                          decreaseMonth={decreaseMonth}
                          increaseMonth={increaseMonth}
                        />
                      )}
                    />
                  </ChakraField>
                )}
              </Field>
            )}

            {mode === 'before' && (
              <Field name="endTime" gap={0}>
                {({ form }: FieldProps<string, FormValues>) => (
                  <ChakraField gap={0}>
                    <ReactDatePicker
                      customInput={
                        <Input
                          aria-label="End date input"
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
                      renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                        <DatePickerCustomHeader
                          date={date}
                          decreaseMonth={decreaseMonth}
                          increaseMonth={increaseMonth}
                        />
                      )}
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
                          aria-label="Start and end date input"
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
                      renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                        <DatePickerCustomHeader
                          date={date}
                          decreaseMonth={decreaseMonth}
                          increaseMonth={increaseMonth}
                        />
                      )}
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
