/**
 * sets local storage and manages error.
 * 
 * @param {string} key 
 * @param {string} value 
 * @param {function} errCallback 
 */

export function setStorage(key, value, errCallback) {
    try {
        localStorage.setItem(key,value);
    } catch (e) {
        errCallback(e);
    }
}