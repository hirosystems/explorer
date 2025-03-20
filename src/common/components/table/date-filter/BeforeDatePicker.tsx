import { Field as ChakraField } from '@/components/ui/field';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Stack } from '@chakra-ui/react';
import { UTCDate } from '@date-fns/utc';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation';
import DatePicker from 'react-datepicker';

interface FormValues {
  endTime: number | null;
}

interface DateRangeFormProps {
  defaultEndTime: number | null;
  onClose?: () => void;
}
export function BeforeDatePicker({ defaultEndTime = Date.now(), onClose }: DateRangeFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialValues: FormValues = {
    endTime: defaultEndTime,
  };
  return (
    <Formik
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={initialValues}
      onSubmit={async ({ endTime }: FormValues) => {
        const params = new URLSearchParams(searchParams);
        const endTimeTs = endTime ? Math.floor(endTime).toString() : undefined;
        params.delete('startTime');
        if (endTimeTs) {
          params.set('endTime', endTimeTs);
        } else {
          params.delete('endTime');
        }
        router.push(`?${params.toString()}`, { scroll: false });
        onClose?.();
      }}
    >
      {() => (
        <Form>
          <Stack gap={4}>
            <Field name="endTime">
              {({ field, form }: FieldProps<string, FormValues>) => (
                <ChakraField>
                  <DatePicker
                    customInput={<Input placeholder="YYYY-MM-DD" variant="redesignPrimary" />}
                    selected={form.values.endTime ? new UTCDate(form.values.endTime * 1000) : null}
                    onChange={date => {
                      if (date) {
                        const utcEnd = new UTCDate(
                          date.getUTCFullYear(),
                          date.getUTCMonth(),
                          date.getUTCDate(),
                          23,
                          59,
                          59
                        );
                        form.setFieldValue('endTime', utcEnd.getTime() / 1000);
                      }
                    }}
                    dateFormat="yyyy-MM-dd"
                  />
                </ChakraField>
              )}
            </Field>
          <Button width="100%" type="submit" size="small" variant={'redesignSecondary'}>
            Apply
          </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
