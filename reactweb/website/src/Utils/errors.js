export const ERRORS = {
  LOGI001: 'Login invalid. Try again',

  RLOG001: 'Enter a valid email address',
  RLOG002: 'Email address already exists',
  RLOG003: 'Your account is not enabled',
  RLOG004: 'Email not found. You need to signup before!',
  RLOG005: 'Your account is not a company account.',
  SECU003: 'Email with auth code already sent, check your mail',
  CLOG001: 'Problem during linkedin authentication',
  SECU003: 'We already sent to you the mail to access, check your mail or wait 5 minutes to perform a clean login',

  GENERIC: 'An error occurred while processing your login'
};

export function getError (code) {
  if (ERRORS[code] != null) {
    return ERRORS[code];
  }
  //console.log(ERRORS.GENERIC);
  return ERRORS.GENERIC;
}

export function getErrorFromApi(error){
  let code = error.response.data.code;
  console.log("code " + JSON.stringify(code));
  return getError(code);
}
