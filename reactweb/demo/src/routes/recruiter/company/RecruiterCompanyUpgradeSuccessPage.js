import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {goToRecruiterDashboard, goToUpgradeSuccess} from '../../../fltr/navigation/NavigationManager';
import AsynchContainer from '../../../fltr/template/AsynchContainer';

@withRouter
@connect((state) => state)
export default class RecruiterCompanyUpgradeSuccessPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AsynchContainer data={this.props.user}>
                <RecruiterCompanyUpgradeSuccessComponent user={this.props.user.item} />
            </AsynchContainer>
        );
    }
}


class RecruiterCompanyUpgradeSuccessComponent extends Component {

    componentDidMount () {
        goToUpgradeSuccess();
    }
    render () {
        return null;
    }
}