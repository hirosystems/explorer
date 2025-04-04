import { Box, Stack } from '@chakra-ui/react';
import { UTCDate } from '@date-fns/utc';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation';
import DatePicker from 'react-datepicker';

import { Field as ChakraField } from '../../../components/ui/field';
import { Button } from '../../../ui/Button';
import { DateInput } from './DateInput';
import { DATE_PICKER_CSS } from './consts';

interface FormValues {
  startTime: number | null;
  endTime: number | null;
}

interface DateRangeFormProps {
  defaultStartTime: number | null;
  defaultEndTime: number | null;
  onClose: () => void;
}

export function DateRangeForm({ defaultStartTime, defaultEndTime, onClose }: DateRangeFormProps) {
  const initialValues: FormValues = {
    startTime: defaultStartTime,
    endTime: defaultEndTime,
  };
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <Formik
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={initialValues}
      onSubmit={async ({ startTime, endTime }: FormValues) => {
        const params = new URLSearchParams(searchParams);
        const startTimeTs = startTime ? Math.floor(startTime).toString() : undefined;
        const endTimeTs = endTime ? Math.floor(endTime).toString() : undefined;
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
        router.push(`?${params.toString()}`, { scroll: false });
        onClose();
      }}
    >
      {() => (
        <Form>
          <Stack gap={4} css={DATE_PICKER_CSS}>
            <Field name="startTime">
              {({ form }: FieldProps<string, FormValues>) => (
                <ChakraField label="Between:">
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
                      form.values.startTime ? new UTCDate(form.values.startTime * 1000) : undefined
                    }
                    endDate={
                      form.values.endTime ? new UTCDate(form.values.endTime * 1000) : undefined
                    }
                    dateFormat="yyyy-MM-dd"
                  />
                </ChakraField>
              )}
            </Field>
          </Stack>
          <Box mt={'16px'}>
            <Button
              width="100%"
              type="submit"
              fontSize={'sm'}
              variant={'secondary'}
              height={'40px'}
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
