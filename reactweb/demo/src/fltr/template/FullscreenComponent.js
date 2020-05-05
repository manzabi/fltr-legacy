import React, { Component } from 'react';
import { closeFullScreenFix, openFullScreenFix } from '../../common/uiUtils';

import PropTypes from 'prop-types';
import {Portal} from 'react-portal';

export default class FullScreenComponent extends Component {

    componentDidMount() {
        if (this.props.manageUiFix) {
            openFullScreenFix();
        }
    }

    componentWillUnmount() {
        if (this.props.manageUiFix) {
            closeFullScreenFix();
        }
    }

    render() {
        const { style, ...rest } = this.props;
        return (
            <Portal>
                <div className='fullscreen-component'>
                    <div {...rest} style={{overflowY: 'auto', overflowX: 'hidden', ...style, height: '100%' }} />
                </div>
            </Portal>
        );
    }

    static propTypes = {
        manageUiFix: PropTypes.bool.isRequired
    }

    static defaultProps = {
        manageUiFix: true
    }
}