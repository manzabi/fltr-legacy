import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {goToRecruiterDashboard} from '../../fltr/navigation/NavigationManager';
import FluttrButton from './FluttrButton';

/**
 * @param onFoward: PropTypes.func.isRequired,
 * @param backButtonText: PropTypes.string,
 * @param fowardButtonText: PropTypes.string,
 * @param onBack: PropTypes.func,
 * @param loading: PropTypes.bool
 */
export default class ButtonBarComponent extends Component {

    render () {
        return (
            <div className='fluttr-button-bar'>
                <FluttrButton type='link' loading={this.props.loading} action={this.props.onBack} >
                    <i className='fal fa-angle-double-left' />&nbsp;{this.props.backButtonText}
                </FluttrButton>
                <FluttrButton loading={this.props.loading} action={this.props.onFoward}>
                    {this.props.fowardButtonText}
                </FluttrButton>
            </div>
        );
    }
}

ButtonBarComponent.PropTypes = {
    onFoward: PropTypes.func.isRequired,
    backButtonText: PropTypes.string,
    fowardButtonText: PropTypes.string,
    onBack: PropTypes.func,
    loading: PropTypes.bool
};

ButtonBarComponent.defaultProps = {
    backButtonText: 'Back',
    fowardButtonText: 'Next',
    onBack: goToRecruiterDashboard,
    loading: false
};
