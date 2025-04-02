export type NonTupleValueType = string | number;

export type TupleValueType = Record<string, NonTupleValueType>;

export type ValueType = TupleValueType | NonTupleValueType;

export type ListValueType = ValueType[];

export function isNonTupleValueType(value: unknown): value is NonTupleValueType {
  return typeof value === 'string' || typeof value === 'number';
}

export function isTupleValueType(value: unknown): value is TupleValueType {
  return !!value && typeof value === 'object' && Object.values(value).every(isNonTupleValueType);
}

export function isValueType(value: unknown): value is ValueType {
  return isNonTupleValueType(value) || isTupleValueType(value);
}

export function isListValueType(value: unknown): value is ListValueType {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every(item => {
    if (isNonTupleValueType(item)) {
      return true;
    }

    if (isTupleValueType(item)) {
      return Object.values(item).every(isValueType);
    }

    return false;
  });
}
