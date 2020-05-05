import React from 'react';
import PropTypes from 'prop-types';

const ModalComponent = ({ backdrop, onClose, open, children }) => {

    const onBackDropClick = () => {
        if (backdrop) {
            onClose && onClose();
        }
    };

    if (!children) { onClose(); }

    return (
        <div className={`modal ${open ? 'show-modal' : ''}`} onClick={onBackDropClick}>
            <div className='modal-content'>
                {children}
            </div>
        </div>
    );
};

ModalComponent.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

ModalComponent.defaultProps = {
    open: false
};

export default ModalComponent;