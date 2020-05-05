import React from 'react';

export default ({ progress }) => (
    <div className='progress-bar'>
        <div style={{ width: progress + '%' }} className='bar' />
    </div>
);
