import React from 'react';
import { CrazyModal } from '@billingfluttr/crazy-ui';

const placeholder = () => { return; };

const closeModalFix = placeholder;
const openModalFix = placeholder;
const hideMainScroll = placeholder;
const showMainScroll = placeholder;

const WebsiteCrazyModal = (props) => {
    const newProps = { ...props, closeModalFix, openModalFix, hideMainScroll, showMainScroll };
    return (<CrazyModal {...newProps} />);
};

export default WebsiteCrazyModal;