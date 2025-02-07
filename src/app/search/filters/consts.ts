export const DATE_PICKER_CSS = {
  '& .react-datepicker': {
    fontFamily: 'var(--stacks-fonts-body) !important',
  },

  '& .react-datepicker__current-month': {
    fontWeight: 'var(--stacks-fontWeights-medium) !important',
    fontSize: 'var(--stacks-fonts-size-sm) !important',
  },

  '& .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range, .react-datepicker__day--selected':
    {
      backgroundColor: 'var(--stacks-colors-brand) !important',
      color: 'white !important',
    },

  '& .react-datepicker__day--disabled': {
    backgroundColor: 'var(--stacks-colors-purple-200) !important',
    color: 'var(--stacks-colors-slate-500) !important',
  },

  '& .react-datepicker__day--keyboard-selected': {
    color: 'white !important',
  },

  '& .react-datepicker__day--today': {
    fontWeight: 'var(--stacks-fonts-weight-medium) !important',
  },

  '& .react-datepicker-wrapper': {
    width: '100%',
  },
};
