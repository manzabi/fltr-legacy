import React from 'react';

import * as TimerUtils from '../../common/timerUtils';

export default class OpportunityTimer extends React.Component {
    constructor (props) {
        super(props);
        const expire = this.getExpire(props);
        // console.log('expire is : ' + JSON.stringify(expire))
        this.state = {
            t: TimerUtils.getTimeRemaining(expire.expireDate),
            isExpireDate: expire.isExpireDate
        };
    }

    getExpire (props) {
        let role = 'normal';
        if (props.role !== undefined) role = props.role;
        // console.log('role : ' + role);
        switch (role) {
        case 'normal':
            return props.data.expire;
        case 'expert':
            const expireExpert = props.data.expire || props.data.challengeDetail && props.data.challengeDetail.expire;
            return expireExpert;
        case 'player':
            return props.data.expire;
        case 'recruiter':
            const expireRecruiter = props.data.challengeDetail && props.data.challengeDetail.expire || props.data.expertDetail && props.data.expire;
            return expireRecruiter;
        default:
            return props.data.expire;
        }
    }

    getStyle () {
        let noColor = false;
        if (this.props.noColor !== undefined) noColor = this.props.noColor;

        if (!noColor) {
            return {
                color: this.color()
            };
        } else {
            return {};
        }
    }

    color () {
        let forceColor = false;
        if (this.props.forceColor !== undefined) forceColor = this.props.forceColor;

        let dayLimit = 1;
        if (this.props.dayLimit !== undefined) dayLimit = this.props.dayLimit;

        let colorNormal = '#2ECC71';
        if (this.props.colorNormal !== undefined) colorNormal = this.props.colorNormal;

        if (forceColor) {
            return '#FF6741';
        }

        if (!this.state.isExpireDate) {
            return '#333';
        }

        let days = (this.state.t.days);
        if (days >= dayLimit) {
            return colorNormal;
        } else {
            return '#FF6741';
        }
    }

    primaryString (days, hours, minutes) {
        let label = true;
        if (this.props.label !== undefined) label = this.props.label;

        let retString = '';
        if (label) {
            if (this.props.ends) {
                retString += ' Expires in ';
            } else {
                retString += ' Starts in ';
            }
        }
        if (days >= 1) {
            return retString + days + ' days';
        } else {
            return retString + hours + 'h:' + minutes + 'm';
        }
    }

    getRemainingTIme () {
        if (!this.state.isExpireDate) {
            return 'Closed';
        }

        var days = (this.state.t.days);
        var hours = ('0' + this.state.t.hours).slice(-2);
        var minutes = ('0' + this.state.t.minutes).slice(-2);
        var seconds = ('0' + this.state.t.seconds).slice(-2);

        return this.primaryString(days, hours, minutes);
    }

    render () {
        let showIcon = true;
        if (this.props.showIcon !== undefined) showIcon = this.props.showIcon;

        return (

            <span className='countdownSelector' style={this.getStyle()}>
                {showIcon &&
                    <i style={this.getStyle()} className='icon-entypo-stopwatch icon-right-padding' />
                }
                {this.getRemainingTIme()}
            </span>

        );
    }
}

OpportunityTimer.defaultProps = {
    ends: true
};
