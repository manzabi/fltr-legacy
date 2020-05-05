import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import ExpertArchivedChallengePageComponent from '../../fltr/expert/opportunity/ExpertArchivedChallengePageComponent';

// import Intercom from '../../fltr/utils/Intercom';

@withRouter
@connect((state) => state)
export default class ExpertArchivedChallengesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title : document.title
        };
    }

    componentDidMount(){
        document.title = 'Active Challenges';
    }

    componentWillUnmount(){
        document.title = this.state.title;
    }

    render() {

        return (
            <div className="containerSection expertArchivedChallengesPage containerSection container-fluid">
                <ExpertArchivedChallengePageComponent />
                {/* <Intercom /> */}
            </div>
        );
    }
}
