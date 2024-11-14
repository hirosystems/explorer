export function getErrorMessage(error: any) {
  return error?.message || 'Something went wrong! Please try again later.';
}
