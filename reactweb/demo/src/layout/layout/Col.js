import React from 'react';

export default function Col({ className = '', xs = '12', sm, md, lg, ...rest }) {
    const params = {
        col: {
            className: className || '',
            ...rest
        },
        offset: {
            className: ''
        }
    };
    if (xs) {
        params.col.className += (' crazy-col-xs-' + xs);
    }
    if (sm) {
        params.col.className += (' crazy-col-sm-' + sm);
    }
    if (md) {
        params.col.className += (' crazy-col-md-' + md);
    }
    if (lg) {
        params.col.className += (' crazy-col-lg-' + lg);
    }
    return (
        <section key='col' {...params.col} />
    );
}