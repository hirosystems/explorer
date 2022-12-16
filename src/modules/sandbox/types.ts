export type TupleValueType = Record<string, string | number>;

export type NonTupleValueType = string | number;

export type ValueType = TupleValueType | NonTupleValueType;

export type ListValueType = ValueType[];
