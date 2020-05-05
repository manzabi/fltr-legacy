export const TYPE_NAVIGATION_REDIRECT = 'NAVIGATION_REDIRECT';

export function navigationRedirect(redirect){
    return function(dispatch) {
        dispatch({
            type: TYPE_NAVIGATION_REDIRECT,
            payload: {redirect: redirect}
        });
    };
}

