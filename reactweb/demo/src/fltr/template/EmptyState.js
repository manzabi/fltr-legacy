import React from 'react';

const EmptyState = ({ children }) => (
    <div className='empty-state text-center'>
        <br />
        {children}
        <br />
        <img className='imageEmpty' src='/imgs/common/rocket.png' />
    </div>
);

export default EmptyState;