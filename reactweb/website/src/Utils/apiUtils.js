
import { RECRUITER_SIGNUP, USER_LOGIN, RECRUITER_EMAIL_CHECK, CANDIDATE_SIGNUP } from './apiEndpoints';

import { getUrl, goToSignupComplete } from './NavigationManager';
import axios from 'axios';
import * as ga from '../Utils/analytics';

export function recruiterSignup(data, history, onError) {
  const url = getUrl(RECRUITER_SIGNUP);
  axios.post(url, data)
    .then(response => {
      ga.track(ga.SIGNUP_RECRUITER_SUCCESS_BUTTON);
      goToSignupComplete(history);
    })
    .catch((err) => {
      if (onError) {
        onError(err);
      };
    });
}

export function isWorkEmail(email, onError) {
  const url = getUrl(RECRUITER_EMAIL_CHECK);
  const data = {
    email
  };
  return axios.post(url, data)
    .then(res => !res.data.personal)
    .catch(err => {
      if (onError) {
        onError(err);
      }
    })
}

export function candidateSignup(data, history, onError) {
  const url = getUrl(CANDIDATE_SIGNUP);
  axios.post(url, data)
    .then(response => {
      ga.track(ga.SIGNUP_TALENT_SUCCESS_BUTTON);
      goToSignupComplete(history);
    })
    .catch((err) => {
      if (onError) {
        onError(err);
      }
    });
}

export function userLogin(data, onSuccess, onError) {
  const url = getUrl(USER_LOGIN);
  axios.post(url, data)
    .then(response => {
      if (onSuccess) {
        onSuccess(response);
      }
    })
    .catch(err => {
      if (onError) {
        onError(err);
      }
    });
}

export function checkRecruiterEmail(email, onSuccess, onError) {
  const url = getUrl(RECRUITER_EMAIL_CHECK);
  axios.post(url, { email })
    .then(response => {
      if (onSuccess) {
        onSuccess(response);
      }
    })
    .catch(err => {
      if (onError) {
        onError(err);
      }
    });
}
