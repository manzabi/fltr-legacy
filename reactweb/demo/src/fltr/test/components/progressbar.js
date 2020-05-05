import React from 'react';

export default ({ progress }) => (
    <div className='progress' style={{ color: progress > 52 ? '#fff' : '#828282' }}>
        <span className='percent'>
            {progress}%
        </span>
        <div style={{width: progress + '%'}} className='bar' />
    </div>
);
