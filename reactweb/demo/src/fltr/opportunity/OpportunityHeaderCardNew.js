import React from 'react';
import {
    Col,
    Row,
    Grid
} from '@sketchpixy/rubix';
import OpportunityTags from './tag/OpportunityTags';

import {getCompanyImage} from '../../fltr/utils/urlUtils';

export default class OpportunityHeaderCardNew extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let opportunity = this.props.data;
        let tags = true;
        if (this.props.tags !== undefined) tags = this.props.tags;

        return (
            <Grid fluid={false}>
                <Row className="vertical-align">
                    <Col xs={12} md={3} className="vertical-flex">
                        <div className="hidden-xs opportunity-company-logo" style={{paddingTop:10, paddingBottom:10}}>
                            <img style={{width:60}} src={getCompanyImage(opportunity.company)} />
                        </div>
                    </Col>
                    <Col xs={12} md={9} className="vertical-flex vertical-flex-left">

                        <Row >
                            <Col xs={12}>
                                <div style={{paddingTop: 12.5, paddingBottom: 12.5}}>

                                    <div className="opportunity-company">
                                        <img style={{float:'left', width:30, marginRight:10}} className="visible-xs" src={getCompanyImage(opportunity.company)} />
                                        {opportunity.company.name}
                                        <p style={{clear:'both'}}></p>
                                    </div>

                                    <div className="opportunity-title">
                                        <i className="icon-entypo-briefcase icon-right-padding" ></i>
                                        {opportunity.roleTitle}
                                    </div>

                                    {tags &&
                                        <div>
                                            <OpportunityTags numberOfTags={this.props.numberOfTags} taglist={opportunity.tagList} />
                                        </div>
                                    }

                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Grid>
        );
    }

}