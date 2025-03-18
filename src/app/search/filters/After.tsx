import { Input } from '@/ui/Input';
import { Stack } from '@chakra-ui/react';
import { UTCDate } from '@date-fns/utc';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation';
import DatePicker from 'react-datepicker';

import { Button } from '@/ui/Button';
import { Field as ChakraField } from '../../../components/ui/field';

interface FormValues {
  startTime: number | null;
}

interface DateFilterProps {
  defaultStartTime: number | null;
  onClose: () => void;
}

export function AfterForm({ defaultStartTime, onClose }: DateFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialValues: FormValues = {
    startTime: defaultStartTime,
  };

  return (
    <Formik
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={initialValues}
      onSubmit={async ({ startTime }: FormValues) => {
        const params = new URLSearchParams(searchParams);
        const startTimeTs = startTime ? Math.floor(startTime).toString() : undefined;
        if (startTimeTs) {
          params.set('startTime', startTimeTs);
        } else {
          params.delete('startTime');
        }
        params.delete('endTime');
        router.push(`?${params.toString()}`, { scroll: false });
        onClose();
      }}
    >
      {() => (
        <Form>
          <Stack gap={4}>
            <Field name="startTime">
              {({ field, form }: FieldProps<string, FormValues>) => (
                <ChakraField>
                  <DatePicker
                    customInput={<Input placeholder="YYYY-MM-DD" variant="redesignPrimary" />}
                    selected={
                      form.values.startTime ? new UTCDate(form.values.startTime * 1000) : undefined
                    }
                    onChange={date => {
                      if (date) {
                        const utcStart = new UTCDate(
                          date.getUTCFullYear(),
                          date.getUTCMonth(),
                          date.getUTCDate(),
                          0,
                          0,
                          0
                        );
                        form.setFieldValue('startTime', utcStart.getTime() / 1000);
                      }
                    }}
                    dateFormat="yyyy-MM-dd"
                  />
                </ChakraField>
              )}
            </Field>
          </Stack>
          <Button width="100%" type="submit" size="small" variant={'redesignSecondary'} mt={4}>
            Apply
          </Button>
        </Form>
      )}
    </Formik>
  );
}
