import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { checkUserUpdate } from '../redux/actions/userActions';
import { getChallengeUsedSlots, getSlotsDetail } from '../fltr/utils/planUtils';
import { Text } from '../layout/FluttrFonts';
import CrazyIcon from '../layout/icons/CrazyIcon';
import { goToUpgrade } from '../fltr/navigation/NavigationManager';

import {showLimitBanner, hideLimitBanner} from '../redux/actions/uiActions';

@withRouter
@connect((state) => state)
export default class HeaderLimitBanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            brokenLimits: {
                challenge: false,
                seat: false,
                talent: false,
                template: false,
                brokenCount: 0
            },
            activeSlotType: 1
        };
    }

    componentDidMount () {
        this.props.dispatch(checkUserUpdate(this.props.userStatus, true, null, this.onCheckSuccess));
    }

    onCheckSuccess = (nextUpdate) => {
        setTimeout(() => {
            this.props.dispatch(checkUserUpdate(this.props.userStatus, false, null, this.onCheckSuccess));
        }, nextUpdate);
    }

    handleCheckLimits = () => {
        const user = this.props.user.item;
        const { company } = user.recruiterDetails;
        const slotTypes = {
            slotChallenges: 'challenge',
            slotBusinessUsers: 'seat',
            slotTalents: 'candidate',
            slotTemplates: 'template'
        };
        if (company) {
            const { used, original } = getSlotsDetail(user);
            const brokenLimits = Object.keys(original).reduce((acc, key) => {
                const currentKey = {type: key, originalSlots: original[key], typeString: slotTypes[key], broken: false};
                if (original[key] === -1) currentKey.broken = true;
                else {
                    const result = original[key] < used[key];
                    currentKey.broken = result;
                    if (result) acc.brokenCount += 1;
                }
                acc.slotTypes = [...acc.slotTypes, currentKey];
                return acc;
            }, { brokenCount: 0 });
            return {
                brokenLimits
            };
            
            // , () => {
            //     if (brokenLimits.brokenCount > 1) this.manageRotation();
            //     else clearInterval(window.rotationInterval);
            //     if (brokenLimits.brokenCount >= 1 ) this.props.dispatch(showLimitBanner());
            //     else this.props.dispatch(hideLimitBanner());
            // });
        }
    }

    componentWillUnmount () {
        clearInterval(window.rotationInterval);
    }

    
    render() {
        try {
            if (this.props.user.item && this.props.user.item.recruiterDetails && this.props.user.item.recruiterDetails.company) {
                const {brokenLimits} = this.handleCheckLimits();
                return (
                    <section className={brokenLimits.brokenCount > 0 ? 'active-banner' : 'inactive-banner'}>
                        <UpgradeBanner brokenLimits={brokenLimits} />
                        {this.props.children}
                    </section>
                );
            } else {
                return (
                    <section className='inactive-banner'>
                        {this.props.children}
                    </section>
                );
            }
        } catch (error) {
            if(window && window.Raven) window.Raven.captureException(error);
            return (
                <section className='inactive-banner'>
                    {this.props.children}
                </section>
            );
        }
    }
}
@connect ((state) => state)
class UpgradeBanner extends Component {
    state = {
        activeSlotType: 1
    }

    componentDidMount () {
        this.manageRotation();
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.brokenLimits && nextProps.brokenLimits && this.props.brokenLimits.brokenCount !== nextProps.brokenLimits.brokenCount) {
            this.setState({
                activeSlotType: 1
            }, this.manageRotation);
        }
    }
    
    componentWillUnmount () {
        if (window.rotationInterval) {
            clearInterval(window.rotationInterval);
        }
    }
    
    manageRotation = async () => {
        const root = this;
        if (window.rotationInterval) {
            clearInterval(window.rotationInterval);
        }
        if (this.props.brokenLimits.brokenCount > 1) {

            window.rotationInterval = setInterval(() => {
                const { activeSlotType } = root.state;
                const {brokenLimits: { brokenCount }} = root.props;
                const nextActive = activeSlotType < brokenCount ? activeSlotType + 1 : 1;
                root.setState({
                    activeSlotType: nextActive
                });
            }, 10000);
        }
    }

    renderBannerMessage = () => {
        const {activeSlotType} = this.state;
        const {brokenLimits} = this.props;
        const activeType = brokenLimits.slotTypes.filter((slot) => slot && slot.broken)[activeSlotType - 1];
        return (
            <div id='upgrade-banner-container'>
                <Text size='sm'>
                    <CrazyIcon icon='icon-lock-alt' />
                    <span className='upgrade-message'>You’ve hit your {activeType.originalSlots} {activeType.typeString}s limit.</span>
                    <span onClick={goToUpgrade} className='upgrade-button'>Upgrade now</span>
                </Text>
            </div>
        );
    }
    
    render () {
        const {brokenLimits} = this.props;
        if (brokenLimits && brokenLimits.brokenCount > 0) {
            if (!this.props.limitBannerStatus) this.props.dispatch(showLimitBanner());
            return (
                <section className='limit-reach-advisor'>
                    {this.renderBannerMessage()}
                </section>
            );
        } else {
            if (this.props.limitBannerStatus)this.props.dispatch(hideLimitBanner());
            return null;
        }
    }
    
}