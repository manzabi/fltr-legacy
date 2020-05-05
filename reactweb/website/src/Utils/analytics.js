import ReactGA from 'react-ga';

//homepage
export const HOMEPAGE_LANDING = { category: 'boarding', action: 'homepage_landing', label: 'landing' };
export const BUTTON_FREEMIUM_FLOATING = { category: 'boarding', action: 'button_freemium', label: 'floating' };
export const BUTTON_FREEMIUM_SLIDER = { category: 'boarding', action: 'button_freemium', label: 'slider' };
export const BUTTON_FREEMIUM_BOTTOM = { category: 'boarding', action: 'button_freemium', label: 'bottom' };

//split
export const SPLIT_SIGNUP_LANDING = { category: 'boarding', action: 'split_landing', label: 'landing' };

//login
export const LOGIN_LANDING = { category: 'boarding', action: 'login_landing', label: 'landing' };
export const LOGIN_SUCCESS = { category: 'boarding', action: 'login', label: 'success' };

//signup
//recruiter
export const SIGNUP_RECRUITER_LANDING = { category: 'boarding', action: 'signup_recruiter', label: 'landing' };
export const SIGNUP_RECRUITER_SUCCESS_BUTTON = { category: 'boarding', action: 'signup_recruiter_button', label: 'success' };
export const SIGNUP_RECRUITER_SUCCESS_LINKEDIN = { category: 'boarding', action: 'signup_recruiter_linkedin', label: 'success' };
export const SIGNUP_SWITCH_RECRUITER = { category: 'boarding', action: 'signup_switch', label: 'to_recruiter' };
export const SIGNUP_RECRUITER_SUCCESS = { category: 'boarding', action: 'signup_complete', label: 'emailsent' };
//talent
export const SIGNUP_TALENT_LANDING = { category: 'boarding', action: 'signup_talent', label: 'landing' };
export const SIGNUP_TALENT_SUCCESS_BUTTON = { category: 'boarding', action: 'signup_talent_button', label: 'success' };
export const SIGNUP_TALENT_SUCCESS_LINKEDIN = { category: 'boarding', action: 'signup_talent_linkedin', label: 'success' };
export const SIGNUP_SWITCH_TALENT = { category: 'boarding', action: 'signup_switch', label: 'to_talent' };


export const SPLIT_SIGNUP_SELECT = function (userType) {
  return ({ category: 'boarding', action: 'split_signup_select', label: userType });
};

export const BUTTON_FREEMIUM_HIW = function (action) {
  return ({ category: 'boarding', action: 'button_freemium', label: action });
};

export const track = ({ category, action, label = '' }) => {
  ReactGA.event({
    category,
    action,
    label
  });
};
export const trackRoute = (route) => {
  console.log(route);
  ReactGA.set(
    { page: route }
  );
  ReactGA.pageview(
    route
  );
};