const FLUTTR_COOKIE_NAME = 'auth';
const FLUTTR_AUTH_PARAM = 'auth';

export function createCookie (name, value, days) {
    let expires = '';
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
}

const getAuth = () => {
    const auth = window.localStorage.getItem(FLUTTR_COOKIE_NAME);
    return auth;
};

const setAuth = () => {
    const queryString = window.location.search.replace('?', '').split('&');
    queryString.forEach((param) => {
        const [key, value] = param.split('=');
        if (key === FLUTTR_AUTH_PARAM) {
            try {
                window.localStorage.setItem(FLUTTR_COOKIE_NAME, value);
            } catch (e) {
                doLogout();
            }
        }
    });
}; 

function redirectToLoginPage () {
    const url = process.env.serverUrl + '/login';
    // browserHistory.push(url);
    window.location.replace(url);
}

function redirectToLogoutPage () {
    window.location.replace(process.env.webLogoutPage);
}

export const doHandleAuth = (history) => {
    const authToken = getAuth();
    if (authToken !== undefined) {
        setAuth(authToken);
        cleanUrl(history);
    }
};

function eraseCookie (name) {
    window.localStorage.removeItem(FLUTTR_COOKIE_NAME);
}

export function doLogout () {
    eraseCookie('auth');
    redirectToLogoutPage();
}

export function getCookie (name) {
    let match = document.cookie.match(RegExp('(?:^|;\\s*)' + escapeCookie(name) + '=([^;]*)'));
    return match ? match[1] : null;
}

function cleanUrl (history) {
    // console.log('cleaning url : ' + location.toString());
    //console.log(removeParam(FLUTTR_AUTH_PARAM, window.location.pathname.toString()));
    history.push(removeParam(FLUTTR_AUTH_PARAM,  window.location.pathname.toString()));
}

function removeParam (key, sourceURL) {
    //console.log('before clean  sourceURL ' + sourceURL);
    let rtn = sourceURL.split('?')[0],
        param,
        params_arr = [],
        queryString = window.location.search.replace('?', '');
    if (queryString !== '') {
        params_arr = queryString.split('&').map((query) => {
            const [key, value] = query.split('=');
            return { key, value };
        });
        params_arr = params_arr.filter((query) => query.key !== key);
        const query = params_arr.map((param) => {
            return `${param.key}=${param.value}`;
        });
        rtn = rtn + '?' + query.join('&');
    }
    return rtn;
}