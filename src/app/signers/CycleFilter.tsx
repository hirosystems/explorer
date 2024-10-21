import { Flex, IconButton, Input } from '@chakra-ui/react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { Field, Form, Formik } from 'formik';
import { useCallback, useState } from 'react';

export function CycleFilter({
  onChange,
  defaultCycleId,
  currentCycleId,
}: {
  onChange: (cycle: string) => void;
  defaultCycleId: string;
  currentCycleId: string;
}) {
  const [cycleId, setCycleId] = useState(defaultCycleId);

  const handleCycleChange = useCallback(
    (newCycleId: string) => {
      setCycleId(newCycleId);
      onChange(newCycleId);
    },
    [setCycleId, onChange]
  );

  return (
    <Formik initialValues={{ cycle: cycleId }} onSubmit={values => handleCycleChange(values.cycle)}>
      {({ values, setFieldValue, submitForm }) => (
        <Form>
          <Flex alignItems="center" gap={1} h="full">
            <IconButton
              aria-label="Previous cycle"
              icon={<CaretLeft />}
              onClick={() => {
                const newCycleId = String(Number(values.cycle) - 1);
                setFieldValue('cycle', newCycleId);
                submitForm();
              }}
              h={5}
              w={5}
            />
            <Field name="cycle">
              {({ field }: any) => (
                <Input
                  {...field}
                  placeholder={defaultCycleId}
                  type="number"
                  textAlign="center"
                  onChange={e => {
                    field.onChange(e);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      submitForm();
                    }
                  }}
                  w={'72px'}
                  h="full"
                />
              )}
            </Field>
            <IconButton
              aria-label="Next cycle"
              icon={<CaretRight />}
              onClick={() => {
                const newCycleId = String(Number(values.cycle) + 1);
                setFieldValue('cycle', newCycleId);
                submitForm();
              }}
              isDisabled={cycleId === currentCycleId}
              h={5}
              w={5}
            />
          </Flex>
        </Form>
      )}
    </Formik>
  );
}
