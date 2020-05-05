import React, {Component } from 'react';
import CrazyModal from './CrazyModal';
import { closeModalFix, openModalFix } from '../../common/uiUtils';
import { hideMainScroll, showMainScroll } from '../../redux/actions/uiActions';
import { connect } from 'react-redux';

@connect(({ mainScrollStatus }) => ({ mainScrollStatus }))
export default class RecruiterCrazyModal extends Component {
    render() {
        const newProps = { ...this.props, closeModalFix, openModalFix, hideMainScroll, showMainScroll, mainScrollStatus: this.props.mainScrollStatus };
        return (<CrazyModal {...newProps} />);
    }
}