import React, {Component} from 'react';

import {Header, Text} from '../../layout/FluttrFonts';

import SectionContainer from '../../common/components/dummy/SectionContainer';
import CrazyButton from '../../layout/buttons/CrazyButtons';
import {isMobile, isTablet} from 'react-device-detect';
import {goBack} from '../../fltr/navigation/NavigationManager';
import {manageWarning} from '../../common/utils';
import FullscreenComponent from '../../fltr/template/FullscreenComponent';

export default class FeatureNotAvailable extends Component {
    state = {
        startupStatus: isMobile || isTablet || window.innerWidth < 1024,
        mobile: isMobile || isTablet || window.innerWidth < 1024
    };

    componentDidMount () {
        window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }

    onResize = ({target}) => {
        const elementWidth = target.innerWidth;
        if (!this.state.mobile) {
            if (elementWidth < 1024) {
                this.setState({mobile: true}, () => {
                    if (this.toast) {
                        this.toast.fadeIn();
                    } else {
                        this.toast = manageWarning('', 'You are running on a small screen resolution, this feature it\'s only available on screens up to 1024 px, please scale up the window again', true);
                    }
                });
            }
        } else if (elementWidth > 1024) {
            this.setState({mobile: false, startupStatus: false}, () => {
                if (this.toast) {
                    this.toast.fadeOut();
                }
            });
        }
    };

    goHome = () => {
        goBack();
    };

    render () {
        const {startupStatus, mobile} = this.state;
        const {manageUiFix} = this.props;
        if (startupStatus && mobile) {
            return (
                <FullscreenComponent manageUiFix={manageUiFix}>
                    <SectionContainer className='error-page'>
                        <section className='error-page-content'>
                            <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/common/responsive.svg' />
                            <div>
                                <Header>Feature available only on desktop</Header>
                                <Text size='md'>The test creation process requires a larger screen, please use a desktop screen.</Text>
                                <CrazyButton size='sidebar' text='Go back' action={this.goHome} inverse />
                            </div>
                        </section>
                    </SectionContainer>
                </FullscreenComponent>
            );
        } else {
            return this.props.children;
        }
    }
}