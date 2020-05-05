import React from 'react';
import { connect } from 'react-redux';

import * as ga from '../../../constants/analytics';

import {
    Row,
    Col,
    Grid,
    Button,
} from '@sketchpixy/rubix';

var Global = require('../../../common/global_constants');

import PanelContainer, {PanelContainerContent} from '../../template/PanelContainer';
import OpportunityChallengeShow from '../../opportunity/challenge/OpportunityChallengeShow';
import {confirmTest, getOpportunityConfigurationDetail} from '../../../redux/actions/recruiterOpportunityActions';
import {scrollFix} from '../../navigation/NavigationManager';

@connect((state) => state)
export default class OpportunityChallengeConfigurationConfirmTestComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        scrollFix();
    }

    getId = () => {
        return this.props.id;
    }

    onConfirm = () => {
        let id = this.getId();
        // dispatch confirm
        this.props.dispatch(confirmTest(id, this.onConfirmOk));
    }

    onConfirmOk = () => {
        ga.track(ga.OPPORTUNITY_CHALLENGE_CONFIGURATION_OWNER_END);
        let id = this.getId();
        // refresh configuration info
        this.props.dispatch(getOpportunityConfigurationDetail(id));
    }

    onEditTest = () => {
        if (this.props.onUpdateChallenge !== undefined){
            this.props.onUpdateChallenge(true);
        }
    }


    render(){

        let id = this.getId();

        return(
            <PanelContainer size="medium" back={false}>
                <PanelContainerContent padding={true} style={{marginTop: 10, marginBottom:60}}>
                    <Grid className="noPadding">
                        <Row>
                            <Col xs={12} className="text-center nopaddingMobile">
                                <span className="sectionTitleStrong">Review your challenge</span>
                            </Col>
                        </Row>

                        <OpportunityChallengeShow id={id} back={false} canUpdate={false} showWrapper={false} />

                        <div className='challenge-confirm-buttons'>
                            <button className='btn-fluttr btn-link' onClick={this.onEditTest} >
                                <i className='fal fa-angle-double-left' />
                                <span style={{paddingLeft: 15}}>back to edit</span>
                            </button>
                            <button className='btn-fluttr btn-green btn-md' onClick={this.onConfirm} >
                                <span style={{paddingRight: 15}}>
                                    Next
                                </span>
                                <i className='fal fa-angle-right' />
                            </button>
                        </div>
                    </Grid>
                </PanelContainerContent>
            </PanelContainer>
        );
    }

}
