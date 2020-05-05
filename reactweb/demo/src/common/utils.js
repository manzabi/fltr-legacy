import { browserHistory } from 'react-router';
import axios from 'axios';

import { hideIntercom, showIntercom } from './uiUtils';

import fileLibrary from '../constants/fileLibrary';

import toastr from 'toastr';

toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: 'toast-bottom-right',
    preventDuplicates: true,
    onclick: null,
    showDuration: 300,
    hideDuration: 1000,
    timeOut: 3200,
    extendedTimeOut: 1000,
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut',
    onHidden: showIntercom
};

const Config = require('Config');
const Global = require('./global_constants');

const FLUTTR_COOKIE_NAME = 'JSESSIONID';
const FLUTTR_AUTH_PARAM = 'auth';
export const COOKIE_RECRUITER_BOARDING = 'boarding_completed';

export function createCookie(name, value, days) {
    let expires = '';
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
}

export function getQueryStringParameterByKey(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, '\\$&'); // escape RegEx meta chars
    let match = location.search.match(new RegExp('[?&]' + key + '=([^&]+)(&|$)'));
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

export function redirectToLoginPage() {
    const url = Config.serverUrl + '/login';
    // browserHistory.push(url);
    window.location.replace(url);
}

function redirectToLogoutPage() {
    window.location.replace(Config.webLogoutPage);
}

function configureAxios(authToken) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;
    // console.log("axios config: " + axios.defaults.headers.common['Authorization']);

    // Add a response interceptor
    axios.interceptors.response.use(function (response) {
        // Do something with response data
        return response;
    }, function (error) {
        // Do something with response error
        if (error.response.status == 401) {
            redirectToLoginPage();
        }
        return Promise.reject(error);
    });
}

export function doHandleDashboardBoarding() {
    let authToken = getQueryStringParameterByKey(FLUTTR_AUTH_PARAM);

    if (authToken != null) {
        // console.log("AUTH TOKEN: " + authToken);
        createCookie('auth', authToken, 300);
        cleanUrl();
    } else {
        authToken = getCookie('auth');
        if (authToken == null) {
            redirectToLoginPage();
        }
    }
    configureAxios(authToken);
}

function eraseCookie(name) {
    createCookie(name, '', -1);
}

export function doLogout() {
    eraseCookie('auth');
    redirectToLogoutPage();
}

function checkIfFluttrCookieExists() {
    let cookieExists = false;
    if (document.cookie.indexOf(FLUTTR_COOKIE_NAME) >= 0) {
        cookieExists = true;
    }
    return cookieExists;
}

export function getCookie(name) {
    let match = document.cookie.match(RegExp('(?:^|;\\s*)' + escapeCookie(name) + '=([^;]*)'));
    return match ? match[1] : null;
}

function cleanUrl() {
    // console.log('cleaning url : ' + location.toString());
    browserHistory.push(removeParam(FLUTTR_AUTH_PARAM, location.toString()));
}

function escapeCookie(s) {
    return s.replace(/([.*+?\^${}()|\[\]\/\\])/g, '\\$1');
}

function removeParam(key, sourceURL) {
    // console.log('during clean  sourceURL ' + sourceURL.split);
    let rtn = sourceURL.split('?')[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf('?') !== -1) ? sourceURL.split('?')[1] : '';
    if (queryString !== '') {
        // console.log('during clean ' + queryString);
        params_arr = queryString.split('&');
        for (let i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split('=')[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        rtn = rtn + '?' + params_arr.join('&');
    }
    return rtn;
}

export function manageError(err, id, defaultError = '') {
    let message = defaultError;
    if (message) message = `${message}. `;
    if (err && err.response.data.message) {
        message += err.response.data.message;
    }
    hideIntercom();
    toastr.options.timeout = Global.MESSAGE_ERROR_DURATION;
    toastr.error(message);

}

export function manageSuccess(id, message) {
    hideIntercom();
    toastr.options.timeout = Global.MESSAGE_INFO_DURATION;
    toastr.success(message);
}

export function manageErrorMessage(id, message) {
    hideIntercom();
    toastr.options.timeout = Global.MESSAGE_ERROR_DURATION;
    toastr.error(message);
}

export function manageWarning(id, message, disableAutoClose) {
    hideIntercom();
    toastr.options.timeOut = disableAutoClose ? 0 : Global.MESSAGE_ERROR_DURATION;
    toastr.options.extendedTimeOut = disableAutoClose ? 0 : toastr.options.extendedTimeOut;
    return toastr.warning(message);
}

export function getFileExtension(fileName) {
    if (fileName) {
        if (fileName.includes('tar.gz')) {
            return 'tar.gz';
        }
        return fileName.split('.').pop();
    }
    return '';
}

export function getFileIcon(fileName) {
    const extension = getFileExtension(fileName);
    const icon = fileLibrary[extension] ? fileLibrary[extension].icon : fileLibrary.generic.icon;
    return icon;
}

export function checkAllObjectParams(object, ...properties) {
    try {
        let newObj = object;
        properties.forEach(prop => { newObj = newObj[prop]; });
        return newObj;
    } catch (e) {
        return false;
    }
}