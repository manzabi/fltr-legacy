import React from 'react';
import { connect } from 'react-redux';

import {
    Col,
    Tabs,
    Tab,
} from '@sketchpixy/rubix';

import * as opportunityChallengeProcessStatus from '../../../constants/opportunityChallengeProcessStatus';
import PanelContainer, {PanelContainerHeader, PanelContainerContent} from '../../template/PanelContainer';
import {resetOpportunityGetById, getOpportunityById} from '../../../redux/actions/recruiterOpportunityActions';

import OpportunityChallengeShow from '../../opportunity/challenge/OpportunityChallengeShow';
import AsynchContainer from '../../template/AsynchContainer';
import OpportunityHeaderCardDetail from '../../opportunity/OpportunityHeaderCardDetail';
import {goToExpertDashboard, goToRecruiterDashboard} from '../../navigation/NavigationManager';
import RecruiterCandidatesComponent from '../candidate/RecruiterCandidatesComponent';
import RecruiterOpportunityJobPageComponent from './RecruiterOpportunityJobPageComponent';
import RecruiterOpportunityChallengeTabComponent from './RecruiterOpportunityChallengeTabComponent';
import RecruiterOpportunityDashboard from './RecruiterOpportunityDashboard';
import Intercom from '../../utils/Intercom';
import { manageSuccess } from '../../../common/utils';
import CommonModal from '../../../common/components/CommonModal';
import FluttrButton from '../../../common/components/FluttrButton';

import CopyToClipboard from 'react-copy-to-clipboard';


@connect((state) => state)
export default class RecruiterOpportunityDetailComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    getId(){
        return this.props.id;
    }

    componentDidMount(){
        this.props.dispatch(resetOpportunityGetById(this.onResetOpportunity.bind(this)));
    }

    onResetOpportunity(){
        this.props.dispatch(getOpportunityById(this.getId()));
    }

    render() {
        let id = this.props.id;
        let opportunity = this.props.recruiterOpportunityGet;

        return (
            <AsynchContainer data={opportunity} manageError={false}>
                <RecruiterOpportunityDetailContent id={id} context={this.props.context} data={opportunity} />
            </AsynchContainer>
        );
    }
}

class RecruiterOpportunityDetailContent extends React.Component {

    constructor(props) {
        super(props);
        const State = {
            selected: 0,
            initialized: [false, false, false, false, false]
        };
        const context = this.props.context;

        switch(context) {
        // case 'jobpost' :
        //     State.selected = 2;
        //     State.initialized[State.selected -1] = true;
        //     break;
        case 'challenge':
            State.selected = 3;
            State.initialized[State.selected -1] = true;
            break;
        case 'team':
            State.selected = 4;
            State.initialized[State.selected -1] = true;
            break;
            //case "dashboard":
            //    State.selected = 5
            //    State.initialized[State.selected -1] = true
            //    break;
        default:
            State.selected = 1;
            State.initialized[State.selected -1] = true;
            break;
        }
        this.state = {...State};

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
        let enableExperts = false;
        let challengeProcessStatus = opportunity.item.challengeDetail.status;
        if (opportunity.item.challengeDetail != null){
            if (challengeProcessStatus != opportunityChallengeProcessStatus.DISABLED){
                enableExperts = true;
            }
        }

        return (
            <div className="recruiterOpportunityDetailContent">
                <OpportunityHeaderCardDetail showInviteModal={this.showInviteModal} data={opportunity.item}/>

                <PanelContainer marginTop={false} padding={false} back={false} onBackButton={() => goToRecruiterDashboard()} size="big">
                    <PanelContainerContent bordered={false} padding={false}>
                        <Col xs={12} className="noPadding">
                            <div>
                                <Tabs activeKey={this.state.selected} onSelect={this.handleSelect} id="dashboard-tabs">
                                    <Tab eventKey={1} title="Candidates" >
                                        {(this.state.selected === 1 || this.state.initialized[1]) &&
                                            <div style={{...style, paddingTop:40}}>
                                                <RecruiterCandidatesComponent id={id} key={id} back={false}/>
                                            </div>
                                        }
                                    </Tab>

                                    {/* <Tab eventKey={2} title="Job Post" >
                                        {(this.state.selected === 2 || this.state.initialized[2]) &&
                                            <div style={{...style, paddingTop: 40}}>
                                                <RecruiterOpportunityJobPageComponent data={opportunity.item} />
                                            </div>
                                        }
                                    </Tab> */}

                                    <Tab eventKey={3} title="Challenge" >
                                        {(this.state.selected === 3 || this.state.initialized[3]) &&
                                            <div style={{...style, paddingBottom: 40, paddingTop:40}}>
                                                <RecruiterOpportunityChallengeTabComponent id={id} data={opportunity.item}/>
                                            </div>
                                        }
                                    </Tab>

                                    <Tab eventKey={4} title="Recruiting Team" >
                                        {(this.state.selected === 4 || this.state.initialized[4]) &&
                                            <div style={{...style, paddingBottom: 40, paddingTop:30}}>
                                                <RecruiterOpportunityTeamPage id={id} back={false} enableExperts={enableExperts}/>
                                            </div>
                                        }
                                    </Tab>
                                    {/*
                                    <Tab eventKey={5} title="Dashboard" >
                                        {(this.state.selected === 5 || this.state.initialized[5]) &&
                                        <div style={{...style, paddingBottom: 40, paddingTop:30}}>
                                            <RecruiterOpportunityDashboard />
                                        </div>
                                        }
                                    </Tab>
                                    */}
                                </Tabs>
                            </div>
                        </Col>
                    </PanelContainerContent>
                </PanelContainer>
                <Intercom />
            </div>
        );
    }
}
