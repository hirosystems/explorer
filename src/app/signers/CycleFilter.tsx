import { Flex, IconButton, Input } from '@chakra-ui/react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { Field, Form, Formik } from 'formik';
import { useCallback, useState } from 'react';

import { useSuspenseCurrentStackingCycle } from '../_components/Stats/CurrentStackingCycle/useCurrentStackingCycle';

export function CycleFilter({
  onChange,
  defaultCycleId,
  placeholder,
  showOnlyInput = false,
}: {
  onChange: (cycle: string) => void;
  defaultCycleId?: string;
  placeholder?: string;
  showOnlyInput?: boolean;
}) {
  const { currentCycleId } = useSuspenseCurrentStackingCycle();
  const [cycleId, setCycleId] = useState(defaultCycleId ?? '');

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
            {!showOnlyInput && (
              <IconButton
                aria-label="Previous cycle"
                icon={<CaretLeft />}
                onClick={() => {
                  const newCycleId = String(Number(values.cycle) - 1);
                  setFieldValue('cycle', newCycleId);
                  submitForm();
                }}
                isDisabled={!cycleId}
                h={5}
                w={5}
              />
            )}
            <Field name="cycle">
              {({ field }: any) => (
                <Input
                  {...field}
                  placeholder={placeholder}
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
            {!showOnlyInput && (
              <IconButton
                aria-label="Next cycle"
                icon={<CaretRight />}
                onClick={() => {
                  const newCycleId = String(Number(values.cycle) + 1);
                  setFieldValue('cycle', newCycleId);
                  submitForm();
                }}
                isDisabled={!cycleId || cycleId === currentCycleId.toString()}
                h={5}
                w={5}
              />
            )}
          </Flex>
        </Form>
      )}
    </Formik>
  );
}
