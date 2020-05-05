import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import ExpertActiveChallengePageComponent from '../../fltr/expert/opportunity/ExpertActiveChallengePageComponent';

import Intercom from '../../fltr/utils/Intercom';
import {EXPERT_ACTIVE_TESTS, getCategory, NOTIFICATIONS} from '../../constants/headerConstants';
import {setHeaderTitle} from '../../redux/actions/uiActions';

@withRouter
@connect((state) => state)
export default class ExpertActiveChallengesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title : document.title
        };
    }

    componentDidMount() {
        const newHeader = [
            getCategory(EXPERT_ACTIVE_TESTS)
        ];
        this.props.dispatch(setHeaderTitle(newHeader));
    }

    componentWillUnmount() {
        this.props.dispatch(setHeaderTitle());
    }


    render() {

        return (
            <div className="containerSection expertActiveChallengePage  containerSection  container-fluid">
                <ExpertActiveChallengePageComponent />
                <Intercom />
            </div>
        );
    }
}
