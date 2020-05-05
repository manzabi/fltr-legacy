import {moveTo} from '../navigation/NavigationManager';


/**
 * @returns {object} It return al the query parsed yn a javascript object
 */
export function serializeQuery() {
    const query = window.location.search.replace('?', '');
    return query.split('&').reduce((acc, currentQuery) => {
        const [key, value] = currentQuery.split('=');
        acc = {
            ...acc,
            [key]: parseInt(value) || value
        };
        return acc;
    }, {});
}

/**
 *
 * @param {string} param Name of the query parameter you want to validate
 * @param value Expected value, the validation is strict, same data type.
 */
export function validateQueryValue(param, value) {
    const selectedParam = serializeQuery()[param];
    return selectedParam === value;
}

/**
 *
 * @param {string} param Required paramiter that you want to extract from the url
 */
export function getQueryParam(param) {
    return serializeQuery()[param];
}

/**
 * 
 * @param {object} company Required. If it contains the property "logo" extract the url
 */

export function getCompanyImage({ logo }) {
    if (logo && logo.url) return logo.url;
    return 'https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/company-placeholder.png';
}

/**
 *
 * @returns {string} Returns the string parsed and ready to concat the rest of the url
 * @param params
 */
export function parseExtraParams (params) {
    if (params && params === Object(params)) {
        return Object.keys(params).reduce((acc, param) => {
            if (acc.length > 0) {
                acc += '&';
            }
            acc += `${param}=${params[param]}`;
            return acc;
        }, '');
    } else if (params) {
        console.error('You are trying to use parseExtraParams with a none object param');
    }
}

/**
 *
 * @param param Param name string
 */
export function removeQueryParam (param) {
    const query = serializeQuery();
    delete query[param];
    const url = composeUrlWithParams(undefined, query);
    moveTo(url);
}

/**
 *
 * @param url
 * @param params
 * @returns {string}
 */
export function composeUrlWithParams (url, params) {
    const paramsQuery = Object.keys(params).reduce((acc, key, index) => {
        if (key) {
            if (index === 0) {
                acc += '?';
            } else if (index > 0) {
                acc += '&';
            }
            acc += `${key}=${params[key]}`;
        }
        return acc;
    }, '');
    const pathName = url || window.location.pathname;
    return `${pathName}${paramsQuery}`;
}