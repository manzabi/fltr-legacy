import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';


import {
    Col,
    Row,
    Grid
} from '@sketchpixy/rubix';
import OpportunityHeaderCard from './OpportunityHeaderCard';
import FluttrButton from '../../common/components/FluttrButton';
import { manageSuccess } from '../../common/utils';
import CommonModal from '../../common/components/CommonModal';

import CopyToClipboard from 'react-copy-to-clipboard';
import { resetOpportunityGetById, getOpportunityById } from '../../redux/actions/recruiterOpportunityActions';

export default class OpportunityHeaderCardDetail extends Component {

    render() {
        let opportunity = this.props.data;

        if (opportunity) {
            return (
                <Grid className="opportunity-header-card">
                    <Row className="vertical-align">
                        <Col xs={12} sm={4} className="vertical-flex noPadding">
                            <OpportunityHeaderCard tags={false} data={opportunity}/>
                        </Col>
                        <Col xs={12} sm={4} className="vertical-flex vertical-flex noPadding">
                            <Grid className="noPadding">
                                <Row className="vertical-align">
                                    <Col xs={4} md={4} className="header-values" style={{textAlign:'center'}}>
                                        {opportunity.commonDetail.numberOfJudges}
                                    </Col>
                                    <Col xs={4} md={4} className="header-values" style={{textAlign:'center'}}>
                                        {opportunity.applied}
                                    </Col>
                                    <Col xs={4} md={4} className="header-values" style={{textAlign:'center'}}>
                                        {opportunity.commonDetail.submittedChallenges}
                                    </Col>
                                </Row>
                                <Row className="opportunity-row-values" style={{marginBottom:0, marginTop:0}}>
                                    <Col xs={4} md={4} style={{textAlign:'center'}}>
                                        <span className="header-values-label">Experts</span>
                                    </Col>
                                    <Col xs={4} md={4} style={{textAlign:'center'}}>
                                        <span className="header-values-label">Applicants</span>
                                    </Col>
                                    <Col xs={4} md={4} style={{textAlign:'center'}}>
                                        <span className="header-values-label">Responses</span>
                                    </Col>
                                </Row>
                            </Grid>
                        </Col>
                        <Col xs={12} sm={4}>
                        </Col>
                    </Row>
                </Grid>
            );
        } else return null;

    }

}