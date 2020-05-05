import React from 'react';
import {
    Col,
    Row,
    Grid
} from '@sketchpixy/rubix';
import OpportunityHeaderCard from './OpportunityHeaderCard';

export default class OpportunityHeaderReviewCardDetail extends React.Component {

    constructor(props) {
        super(props);
    }

    onViewChallenge(){
        if (this.props.onViewChallenge !== undefined) {
            this.props.onViewChallenge();
        }
    }

    render() {
        let opportunity = this.props.data;

        return (
            <section style={{backgroundColor: 'white'}}>
                <Grid>
                    <Row className="vertical-align">
                        <Col xs={12} md={5} className="vertical-flex noPadding">
                            <OpportunityHeaderCard numberOfTags={8} data={opportunity}/>
                        </Col>
                        <Col xs={12} md={4} className="vertical-flex vertical-flex noPadding">
                            <Grid fluid={false} className="noPadding">
                                <Row className="vertical-align">
                                    <Col xs={6} md={6} className="header-values" style={{textAlign:'center'}}>
                                        {opportunity.commonDetail.submittedChallenges}
                                    </Col>
                                    <Col xs={6} md={6} className="header-values" style={{textAlign:'center'}}>
                                        {opportunity.levelSeniority}
                                    </Col>
                                </Row>
                                <Row className="opportunity-row-values" style={{marginBottom:0, marginTop:0}}>
                                    <Col xs={6} md={6} style={{textAlign:'center'}}>
                                        <span className="header-values-label">Total Submissions</span>
                                    </Col>
                                    <Col xs={6} md={6} style={{textAlign:'center'}}>
                                        <span className="header-values-label">Position Type</span>
                                    </Col>
                                </Row>
                            </Grid>
                        </Col>
                        <Col xs={12} md={3} className="vertical-flex vertical-flex noPadding">
                            <a href="#" onClick={() => this.onViewChallenge()} className="buttonShowChallenge">
                                <i className="icon-entypo-book" ></i> View Challenge
                            </a>
                        </Col>
                    </Row>
                </Grid>
            </section>
        );
    }

}