import React from 'react';
import { connect } from 'react-redux';

import {
    Col,
    Tabs,
    Tab,
} from '@sketchpixy/rubix';

import PanelContainer, {PanelContainerHeader, PanelContainerContent} from '../../../template/PanelContainer';
import {getOpportunity, resetGetOpportunity} from '../../../../redux/actions/reviewActions';

import OpportunityChallengeShow from '../../../opportunity/challenge/OpportunityChallengeShow';
import UserToReview from './UserToReview';
import ExpertListComponent from './ExpertListComponent';
import LeaderboardComponent from './LeaderboardComponent';
import AsynchContainer from '../../../template/AsynchContainer';
import OpportunityHeaderCardDetail from '../../../opportunity/OpportunityHeaderCardDetail';
import {goToExpertDashboard} from '../../../navigation/NavigationManager';

// import Intercom from '../../../utils/Intercom';
import {manageErrorMessage} from '../../../../common/utils';
import CommonModal from '../../../../common/components/CommonModal';
import {EXPERT_ACTIVE_TESTS, getCategory} from "../../../../constants/headerConstants";
import {getOpportunitySubString} from "../../../../common/uiUtils";
import {setHeaderTitle} from "../../../../redux/actions/uiActions";

@connect((state) => state)
export default class ReviewComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            locked : true
        };
    }

    componentDidMount(){
        this.props.dispatch(resetGetOpportunity());

        this.callApi();

    }


    render() {
        let id = this.props.id;
        let opportunity = this.props.reviewOpportunity;

        return (
            <AsynchContainer data={opportunity} manageError={false} locked={this.state.locked}>
                <ReviewContent id={id} data={opportunity} />
            </AsynchContainer>
        );
    }

    callApi(){
        let id = this.props.id;
        this.props.dispatch(getOpportunity(id, this.onLoadedItem.bind(this)));
    }

    onLoadedItem(data){
        this.setState({
            locked : false
        });
    }
}

@connect(({dispatch}) => ({dispatch}))
class ReviewContent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: 1,
            initialized: [true, false, false, false]
        };

    }

    componentDidMount(){
        const opportunity = this.props.data.item;
        const newHeader = [
            getCategory(EXPERT_ACTIVE_TESTS),

        ];
        newHeader.push({ id: 'CONFIGURE_TEST', text: `${opportunity.roleTitle} ${getOpportunitySubString(opportunity)}` });
        this.props.dispatch(setHeaderTitle(newHeader));
    }

    componentWillMount(){

        // SECURITY CHECK
        let opportunity = this.props.data.item;
        if (!opportunity.judge){
            manageErrorMessage('review-unauthorized', 'You are not authorized to access this challenge');
            goToExpertDashboard();
        }
    }


    handleSelect = (key) => {

        let arrayInitialized = this.state.initialized;
        arrayInitialized[key] = true;

        this.setState({
            selected: key,
            initialized: arrayInitialized
        });
    }

    

    render(){
        let id = this.props.id;
        let opportunity = this.props.data;

        const style = {
            minHeight: 500,
        };

        // console.log('selected : ' + this.state.selected);
        // console.log('selected == 1 : ' + (this.state.selected === 1));
        // console.log('this.state.initialized[1] : ' + this.state.initialized[1]);

        return (
            <div className="reviewComponent">
                <PanelContainer className="reviewComponent" back={true} onBackButton={() => goToExpertDashboard()} size="big">
                    <PanelContainerHeader padding={false}>
                        <OpportunityHeaderCardDetail data={opportunity.item} showInviteModal={this.showInviteModal} />
                    </PanelContainerHeader>
                    <PanelContainerContent padding={false} style={{marginTop: 10}}>
                        <Col xs={12} className="noPadding">
                            <Tabs activeKey={this.state.selected} onSelect={this.handleSelect} id="dashboard-tabs">

                                <Tab eventKey={1} title="Review" >
                                    {(this.state.selected === 1 || this.state.initialized[1]) &&
                                    <div style={{...style, paddingTop:40}}>
                                        <UserToReview id={id} opportunity={opportunity.item}/>
                                    </div>
                                    }
                                </Tab>

                                <Tab eventKey={2} title="Challenge" >
                                    {(this.state.selected === 2 || this.state.initialized[2]) &&
                                    <div style={{...style, paddingBottom: 40}}>
                                        <OpportunityChallengeShow id={id} back={false} bordered={false}/>
                                    </div>
                                    }
                                </Tab>

                                <Tab eventKey={4} title="Leaderboard" >
                                    {(this.state.selected === 4 || this.state.initialized[4]) &&
                                    <div style={{...style, paddingTop: 40}}>
                                        <LeaderboardComponent id={id}/>
                                    </div>
                                    }
                                </Tab>

                                <Tab eventKey={3} title="Experts" >
                                    {(this.state.selected === 3 || this.state.initialized[3]) &&
                                    <div style={{...style, paddingTop: 40}}>
                                        <ExpertListComponent id={id}/>
                                    </div>
                                    }
                                </Tab>
                            </Tabs>
                        </Col>
                    </PanelContainerContent>
                </PanelContainer>
                {/* <Intercom /> */}
            </div>
        );
    }
}
