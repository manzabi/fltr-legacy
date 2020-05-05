import React from 'react';
import { browserHistory } from 'react-router';

const BackButton = (props) => {
    const onClickButton = () => {
        let onBackButton = browserHistory.goBack;
        if (props.onBackButton !== undefined) onBackButton = props.onBackButton;

        onBackButton();
    };

    return (
        <div style={{ ...props.style }}>
            <button className='hidden-print backButton' onClick={() => onClickButton()}>
                <i className='icon-entypo-cross' />
            </button>
        </div>
    );
};

export default BackButton;