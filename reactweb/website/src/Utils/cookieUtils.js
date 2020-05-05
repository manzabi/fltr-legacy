export const COOKIE_CONSENT = 'cookie_consent_accepted';

export function createCookie (name, value, days) {
  let expires = '';
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + value + expires + '; path=/';
}

export function getCookie (name) {
  let match = document.cookie.match(RegExp('(?:^|;\\s*)' + escapeCookie(name) + '=([^;]*)'));
  return match ? match[1] : null;
}

function escapeCookie (s) {
  return s.replace(/([.*+?\^${}()|\[\]\/\\])/g, '\\$1');
}
