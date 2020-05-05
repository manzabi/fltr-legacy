import {gotoServiceUnavailable} from '../navigation/NavigationManager';

import toastr from 'toastr';
import { getCookie } from '../../common/utils';

export function userError (apiError) {
    try {
        const {status, statusText, data: {error, error_description: errorDescription}, config: {headers: {Authorization}}} = apiError;
        const authToken = Authorization ? Authorization.slice(Authorization.length - 8) : Authorization;
        const userId = getCookie('userId');
        const trackeableError = {
            status, statusText, error, errorDescription, authToken, conectionStatus: window.navigator.onLine, userId
        };
        const err = new Error('User fetch error');
        window.Raven.captureException(err, {extra: {trackeableError, apiError}});
        if (status !== 401) gotoServiceUnavailable();
        // else redirectToLoginPage();
    } catch (error) {
        const userId = getCookie('userId');
        window.Raven.captureException(error, {extra: apiError, status: apiError.status, userId});
        if (apiError.status !== 401) gotoServiceUnavailable();
        // else redirectToLoginPage();
    }
}

export function checkOnlineStatusAndProceed (onProceed, onError) {
    const online = window && window.navigator && typeof(window.navigator.onLine) === 'boolean' ? window.navigator.onLine : true;
    if (online) {
        onProceed();
    } else {
        toastr.options = {
            'closeButton': false,
            'debug': false,
            'newestOnTop': false,
            'progressBar': false,
            'positionClass': 'toast-bottom-right',
            'preventDuplicates': false,
            'onclick': null,
            'showDuration': '300',
            'hideDuration': '1000',
            'timeOut': '5000',
            'extendedTimeOut': '3000',
            'showEasing': 'swing',
            'hideEasing': 'linear',
            'showMethod': 'fadeIn',
            'hideMethod': 'fadeOut'
        };
        toastr['error']('You are currently offline, check your network connection and try again', 'No connection');
        if (onError) {
            onError();
        }
    }
}