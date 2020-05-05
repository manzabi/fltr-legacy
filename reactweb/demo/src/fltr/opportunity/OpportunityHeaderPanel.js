import React from 'react';
import {
    Col,
    Row,
    Grid
} from '@sketchpixy/rubix';
import { getCompanyImage } from '../utils/urlUtils';

export default class OpportunityHeaderPanel extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let opportunity = this.props.data;

        return (
            <div className="opportunityHeaderPanel">
                <Grid>
                    <Row className="vertical-align">
                        <Col xs={1} className="vertical-flex vertical-flex-align-left noPadding">
                            <img style={{width:30}} src={getCompanyImage(opportunity.company)} />
                        </Col>
                        <Col xs={11} className="vertical-flex vertical-flex-align-left noPadding">
                            <span className="company">
                                {opportunity.company.name}
                            </span>
                        </Col>
                    </Row>
                    <Row style={{marginTop:10}}>
                        <Col xs={12} className="noPadding">
                            <span className="role">
                                {opportunity.roleTitle}
                            </span>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }

}