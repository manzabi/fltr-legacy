/**
 * @returns {object} It return al the query parsed yn a javascript object
 */
export function serializeQuery () {
    const query = window.location.search.replace('?', '');
    const parsedQuery = query.split('&').reduce((acc, currentQuery) => {
        const [key, value] = currentQuery.split('=');
        acc = {
            ...acc,
            [key]: value
        };
        return acc;
    }, {});
    return parsedQuery;
}

/**
 * 
 * @param {string} param Name of the query paramiter you want to validate
 * @param value Expected value, the validation is strict, same data type.
 */
export function validateQueryValue (param, value) {
    const selectedParam = serializeQuery()[param];
    const isValid = selectedParam === value;
    return isValid;
}

/**
 * 
 * @param {string} param Required paramiter that you want to extract from the url
 */
export function getQueryParam (param) {
    return serializeQuery()[param];
}