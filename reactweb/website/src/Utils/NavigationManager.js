import history from '../Utils/history'

export function getAbout () {
  return process.env.serverUrl + '/about';
}

export function getPricing () {
  return process.env.serverUrl + '/pricing';
}

export function getForApplicants () {
  return process.env.serverUrl + '/opportunities/list';
}
export function getBlog () {
  return 'https://medium.com/@Fluttr_BCN';
}

export function getRecruiterAccess () {
  return process.env.serverUrl + '/recruiter/signup';
}

export function getPrivacyPolicy () {
  return process.env.serverUrl + '/privacypolicy';
}

export function getCookies () {
  return process.env.serverUrl + '/cookies';
}

export function getTermsAndConditions () {
  return process.env.serverUrl + '/termsandconditions';
}

export function getHowItWoks () {
  return '/how-it-works';
}

export function getHome () {
  return '/';
}

export function goToSignupComplete () {
  history.push('/signup/complete');
}

export function goToPricing () {
  history.push('/pricing');
}

export function goToContacSales (id) {
  history.push(`/pricing/contact/${id}`)
}

// ------------------SPRING LAYER
export function userSignup (userType) {
  return `/${userType}/signup`;
}
export function userLogin (userType) {
  return `/login`;
}

export function signUpLinkedin (userType) {
  return `${process.env.serverUrl}/${userType}/signup-router/linkedin`;
}
export function loginLinkedin (userType) {
  return `${process.env.serverUrl}/login-router/linkedin`;
}

// ------------------ gENERIC FUNCTIONS
export function getUrl (path) {
  return `${process.env.serverUrl}${path}`;
}

export function redirectTo (path) {
  const url = getUrl(path);
  window.location.href = url;
}

/*
export function getUrlParam(urlString, param){
    let url = new URL(urlString);
    return url.searchParams.get(param);
}
*/

export function getUrlParam (url, name) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}