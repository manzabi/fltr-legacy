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

import Iframe from 'react-iframe';

import {goToRecruiterOpportunityUpdate, goToOpportunityConfigureProviders} from '../../navigation/NavigationManager';
import * as opportunityStatus from '../../../constants/opportunityStatus';

import OpportunityTimer from '../../opportunity/OpportunityTimer';

@connect((state) => state)
export default class RecruiterOpportunityJobPageComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }
    render(){
        let url = this.props.data.url + '?onepage=true';
        let opportunityStatusId = this.props.data.statusId;

        return(
            <div className="containerMaxSize">
                <Grid>
                    <Row style={{paddingBottom: 20}}>
                        <Col xs={12}>
                            <span className="opportunity-detail-header-status">
                                Status:
                                <span style={{marginLeft:10}} className={opportunityStatus.getClassForOpportunityStatus(this.props.data.statusId)}>
                                    {this.props.data.statusDescription}
                                </span>


                                {opportunityStatus.checkTimer(this.props.data.statusId) &&
                                    <span className="header-values-label" style={{fontWeight:400}}>
                                        <div style={{display:'inline', marginLeft:20}}>
                                            <OpportunityTimer key={this.props.data.id} data={this.props.data} ends={true}/>
                                        </div>
                                    </span>
                                }

                            </span>
                        </Col>
                        <Col xs={12} className="text-right recruiter-opportunity-buttons">
                            <Button target="_blank" bsStyle='link' style={{marginRight: 10}} className="btn-link-big" onClick={() => goToOpportunityConfigureProviders(this.props.data.id)}>
                                <i className="fal fa-share-alt" style={{fontSize: 1 + 'em'}}></i> Edit sharing status
                            </Button>

                            <Button bsStyle='link' onClick={() => goToRecruiterOpportunityUpdate(this.props.data.id)} title="Edit" className="btn-link-big">
                                <i className="icon-entypo-edit"  style={{fontSize: 1 + 'em'}}></i> Edit
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Iframe url={url}
                                width="100%"
                                height="300vh"
                                id="myId"
                                className="myClassname"
                                display="initial"
                                position="relative"
                                allowFullScreen/>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }

}
