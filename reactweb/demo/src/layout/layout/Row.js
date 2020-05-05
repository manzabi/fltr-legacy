import React from 'react';

export default function Row ({className = '', revertMargin, ...rest}) {
    const params = {
        ...rest,
        className: `crazy-row ${revertMargin ? 'no-margin' : ''} ${className}`
    };
    return (
        <section {...params} />
    );
}