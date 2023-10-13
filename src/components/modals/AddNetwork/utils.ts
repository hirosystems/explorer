import { string } from 'yup';

export async function validateUrl(
  missingErrorMessage: string,
  invalidErrorMessage: string,
  url?: string
) {
  if (!url) {
    return {
      isValid: false,
      message: missingErrorMessage,
    };
  }
  const isValid = await string()
    .matches(
      /^(?:([a-z0-9+.-]+):\/\/)(?:\S+(?::\S*)?@)?(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/
    )
    .isValid(url);
  return {
    isValid,
    message: isValid ? '' : invalidErrorMessage,
  };
}
