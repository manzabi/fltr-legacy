import React from 'react';

const CrazySeparator = ({ text = '', style = {} }) => {
    return (
        <hr
            data-text={text}
            style={style}
            className='crazy-separator'
        />
    );
};

export default CrazySeparator;