import React from 'react';
import { connect } from 'react-redux';
import {
    Row,
    Col,
    Grid,
    Button,
    OverlayTrigger,
    Tooltip,
} from '@sketchpixy/rubix';

import * as ga from '../../../constants/analytics';

import * as opportunityChallengeProcessStatus from '../../../constants/opportunityChallengeProcessStatus';

import OpportunityChallengeShow from '../../opportunity/challenge/OpportunityChallengeShow';
import OpportunityTimer from '../../opportunity/OpportunityTimer';
import {manageSuccess} from '../../../common/utils';
import {goToRecruiterConfigure, goToRecruiterEditChallenge} from '../../navigation/NavigationManager';

@connect((state) => state)
export default class RecruiterOpportunityChallengeTabComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    getId(){
        return this.props.id;
    }

    onCopyClipboardOk(){
        manageSuccess('copy-clipboard', 'Link copied to clipboard!');
    }

    renderButtonConfiguration(){
        let id = this.props.data.id;
        let challengeProcessStatus = this.props.data.challengeDetail.status;
        let recruiterDetail = this.props.data.recruiterDetail;
        const empty = <div></div>;

        switch (challengeProcessStatus){
        case opportunityChallengeProcessStatus.DISABLED:
            return (
                <div></div>
            );
        case opportunityChallengeProcessStatus.WAITING_CONF:
            return (
                <OverlayTrigger placement="top" overlay={<Tooltip id='tooltip'>Configure the challenge</Tooltip>}>
                    <Button onClick={() => goToRecruiterConfigure(id)} target="_blank" bsStyle='fluttrOrange'>
                            Configure the Challenge
                    </Button>
                </OverlayTrigger>
            );
        case opportunityChallengeProcessStatus.WAITING_TEST:
            return (
                <OverlayTrigger placement="top" overlay={<Tooltip id='tooltip'>Check the challenge</Tooltip>}>
                    <Button onClick={() => goToRecruiterConfigure(id)} target="_blank" bsStyle='fluttrOrange'>
                            Configure the test
                    </Button>
                </OverlayTrigger>
            );
        case opportunityChallengeProcessStatus.WAITING_CONFIRM_TEST:
            return (
                <OverlayTrigger placement="top" overlay={<Tooltip id='tooltip'>Review the test and go live!</Tooltip>}>
                    <Button onClick={() => goToRecruiterConfigure(id)} target="_blank" bsStyle='fluttrOrange'style={{marginRight:10}}>
                        <i className="icon-entypo-check" style={{fontSize: 1 + 'em'}}></i> Review test
                    </Button>
                </OverlayTrigger>
            );
        case opportunityChallengeProcessStatus.WAITING_CONFIRM:
            return (
                <OverlayTrigger placement="top" overlay={<Tooltip id='tooltip'>Confirm the challenge and go live!</Tooltip>}>
                    <Button onClick={() => goToRecruiterConfigure(id)} target="_blank" bsStyle='fluttrOrange'style={{marginRight:10}}>
                        <i className="icon-entypo-check" style={{fontSize: 1 + 'em'}}></i> Confirm
                    </Button>
                </OverlayTrigger>
            );
        default:
            return empty;
        }


    }

    trackGA = () => {
        ga.track(ga.OPPORTUNITY_JOB_LINK);
    }
    render(){
        let challengeDetail = this.props.data.challengeDetail;
        let challengeProcessStatusDescription = challengeDetail.statusDescription;
        let challengeProcessStatus = challengeDetail.status;
        let showChallenge = opportunityChallengeProcessStatus.checkForChallengeShow(challengeProcessStatus);

        return(
            <div className="containerMaxSize">
                <Grid>
                    <Row style={{paddingBottom: 20}}>
                        <Col xs={5}>
                            <span className="opportunity-detail-header-status">
                                Status:
                                <span style={{marginLeft:10}} className={opportunityChallengeProcessStatus.getClassForChallengeProcessStatus(challengeProcessStatus)}>
                                    {challengeProcessStatusDescription}
                                </span>

                                {opportunityChallengeProcessStatus.checkTimer(challengeProcessStatus) &&
                                    <span className="header-values-label" style={{fontWeight:400}}>
                                        <div style={{display:'inline', marginLeft:20}}>
                                            <OpportunityTimer role="recruiter" key={this.props.data.id} data={this.props.data} ends={true}/>
                                        </div>
                                    </span>
                                }

                                <span style={{marginLeft:20}}>
                                    {this.renderButtonConfiguration()}
                                </span>
                            </span>
                        </Col>
                        <Col xs={7} className="text-right recruiter-opportunity-buttons">
                            {showChallenge &&
                                <span>
                                    <Button onClick={() => goToRecruiterConfigure(this.props.data.id)} bsStyle='link' className="btn-link-big" style={{marginRight: 10}}>
                                        <i className="icon-entypo-edit"  style={{fontSize: 1 + 'em'}}></i> Edit Test
                                    </Button>
                                </span>
                            }
                        </Col>
                    </Row>

                    {showChallenge &&
                        <div>
                            <Row>
                                <Col xs={12}>
                                    <Grid className="sectionBordered">
                                        <Row>
                                            <Col xs={12}>
                                                <OpportunityChallengeShow id={this.getId()} back={false} bordered={false} canUpdate={false}/>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </Col>
                            </Row>
                        </div>
                    }
                </Grid>
            </div>
        );
    }

}
