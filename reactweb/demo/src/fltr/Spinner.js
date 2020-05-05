import React from 'react';
const Spinner = ({ style }) => (
    <div className='sk-circle' style={style}>
        {Array(12).fill('').map((e, i) => <div className={`sk-circle${i + 1} sk-child`} />)}
    </div>
);

export default Spinner;