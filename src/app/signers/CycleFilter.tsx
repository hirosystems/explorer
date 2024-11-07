import { Button, Flex, Icon, Input } from '@chakra-ui/react';
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
    <Formik
      initialValues={{ cycle: cycleId }}
      onSubmit={values => handleCycleChange(values.cycle)}
      height="100%"
    >
      {({ values, setFieldValue, submitForm }) => (
        <Form>
          <Flex alignItems="center" gap={1} h="full">
            {!showOnlyInput && (
              <Button
                aria-label="Previous cycle"
                onClick={() => {
                  const newCycleId = String(Number(values.cycle) - 1);
                  setFieldValue('cycle', newCycleId);
                  submitForm();
                }}
                disabled={!cycleId}
                h={4}
                w={4}
                backgroundColor="cycleFilter.iconButton.backgroundColor"
                _hover={{ backgroundColor: 'cycleFilter.iconButton.hoverBackgroundColor' }}
              >
                <Icon h={4} w={4} color="text">
                  <CaretLeft />
                </Icon>
              </Button>
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
                  css={{
                    /* Hide the spinners in WebKit browsers (Chrome, Safari, Edge) */
                    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                      '-webkit-appearance': 'none',
                      margin: 0,
                    },
                    /* Hide the spinners in Firefox */
                    '&[type="number"]': {
                      '-moz-appearance': 'textfield',
                    },
                  }}
                />
              )}
            </Field>
            {!showOnlyInput && (
              <Button
                aria-label="Next cycle"
                onClick={() => {
                  const newCycleId = String(Number(values.cycle) + 1);
                  setFieldValue('cycle', newCycleId);
                  submitForm();
                }}
                disabled={!cycleId || cycleId === currentCycleId.toString()}
                h={4}
                w={4}
                backgroundColor="cycleFilter.iconButton.backgroundColor"
                _hover={{ backgroundColor: 'cycleFilter.iconButton.hoverBackgroundColor' }}
              >
                <Icon h={4} w={4} color="text">
                  <CaretRight />
                </Icon>
              </Button>
            )}
          </Flex>
        </Form>
      )}
    </Formik>
  );
}
