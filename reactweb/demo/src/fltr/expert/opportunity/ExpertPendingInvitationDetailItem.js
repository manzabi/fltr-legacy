import React from 'react';
import { connect } from 'react-redux';

import {
    Row,
    Col,
    Grid,
    Badge,
    Button,
    Modal,
    OverlayTrigger,
    Tooltip,
} from '@sketchpixy/rubix';

import * as pendingTypes from '../../../constants/opportunityJudgePendingType';

import {acceptExpertPendingOpporunity, declineExpertPendingOpporunity} from '../../../redux/actions/opportunityActions';

import {goToExpertCreateChallenge} from '../../navigation/NavigationManager';

import { Entity } from '@sketchpixy/rubix/lib/L20n';
import { getCompanyImage } from '../../utils/urlUtils';


@connect((state) => state)
export default class ExpertPendingInvitationDetailItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            answered: false,
            showCancelModal: false
        };
    }

    onUpdateOpportunities(){
        if (this.props.onUpdateOpportunities !== undefined){
            this.props.onUpdateOpportunities();
        }
    }

    close() {
        this.setState({ showCancelModal: false });
    }

    accept(){
        this.props.dispatch(acceptExpertPendingOpporunity(this.props.data.opportunity.id, this.onUpdateOpportunities.bind(this)));
    }

    decline(){
        this.setState({ showCancelModal: true });
    }

    proceedDecline(){
        this.props.dispatch(declineExpertPendingOpporunity(this.props.data.opportunity.id, this.onUpdateOpportunities.bind(this)));
        this.close();
    }

    goToSubmitQuestion(){
        goToExpertCreateChallenge(this.props.data.opportunity.id);
    }


    render() {
        let data = this.props.data;
        let tagList = data.opportunity.tagList;

        return (
            <div>
                <Grid>
                    <Row className="opportunityItem bordered" style={{paddingTop: 10, paddingBottom: 20}}>
                        <Col xs={12}>
                            <Grid style={{backgroundColor:'white', padding: 0}}>
                                <Row className="vertical-align">
                                    <Col xs={12} md={2} className="vertical-flex">
                                        <div className="hidden-xs opportunity-company-logo">
                                            <img src={getCompanyImage(this.props.data.opportunity.company)} />
                                        </div>
                                    </Col>
                                    <Col xs={12} md={5} className="vertical-flex vertical-flex-left">
                                        <div style={{paddingTop: 12.5, paddingBottom: 12.5}}>

                                            <div className="opportunity-company">
                                                <img style={{float:'left', width:30, marginRight:10}} className="visible-xs" src={getCompanyImage(this.props.data.opportunity.company)} />
                                                {this.props.data.opportunity.company.name}
                                                <p style={{clear:'both'}}></p>
                                            </div>

                                            <div className="opportunity-title">

                                                <i className="icon-entypo-briefcase icon-right-padding" ></i>
                                                {this.props.data.opportunity.roleTitle} </div>

                                            <Grid>
                                                <Row className="opportunity-row-values" style={{marginBottom:0}}>
                                                    <Col md={12} style={{padding:0}}>
                                                        <i className="icon-entypo-lab-flask icon-right-padding fluttrBlue" ></i>
                                                        {tagList &&
                                                            tagList.map((s) =>
                                                                <Badge key={s.key} style={{marginRight: '5px'}} className="tagFluttr" >
                                                                    {s.value}
                                                                </Badge>
                                                            )
                                                        }
                                                    </Col>
                                                </Row>
                                            </Grid>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={5} className="vertical-flex vertical-flex-left">
                                        <Grid>
                                            <Row className="vertical-align nopaddingMobile">
                                                <Col md={12} className="vertical-flex vertical-flex-align-right nopaddingMobile">
                                                    <Grid>
                                                        <Row className="sectionInternal">
                                                            <span className="summarySubTitle">Do you want to participate as expert?</span>
                                                        </Row>

                                                        {data.type === pendingTypes.EXPERT &&
                                                        <Row>
                                                            <Col md={6} style={{textAlign:'center'}}>
                                                                <Button bsStyle="fluttrRed" onClick={() => this.decline()}>
                                                                no
                                                                </Button>
                                                            </Col>

                                                            <Col md={6} style={{textAlign:'center'}}>
                                                                <Button bsStyle="fluttrGreen" onClick={() => this.accept()}>
                                                                    yes
                                                                </Button>
                                                            </Col>

                                                        </Row>
                                                        }

                                                        {data.type === pendingTypes.CHALLENGE &&
                                                        <Row style={{textAlign:'center'}}>
                                                            <Col xs={12}>
                                                                <OverlayTrigger placement="top" overlay={<Tooltip id='tooltip'><strong>Submit</strong> challenge test</Tooltip>}>
                                                                    <Button onClick={() => this.goToSubmitQuestion()} bsStyle='warning'>
                                                                        <i className="icon-entypo-edit"  style={{fontSize: 1 + 'em'}}></i> Create the challenge
                                                                    </Button>
                                                                </OverlayTrigger>
                                                            </Col>
                                                        </Row>
                                                        }

                                                    </Grid>
                                                </Col>
                                            </Row>
                                        </Grid>
                                    </Col>
                                </Row>
                            </Grid>
                        </Col>
                    </Row>
                </Grid>

                <Modal show={this.state.showCancelModal} onHide={() => this.close()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Decline opportunity</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>
                            Are you really sure to decline the invitation?
                        </h4>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button className='button-distance'  onClick={() => this.close()}>
                            <Entity entity='genericClose'/>
                        </Button>

                        <Button className='button-distance' bsStyle="fluttrRed" onClick={() => this.proceedDecline()}>
                            Decline
                        </Button>

                    </Modal.Footer>

                </Modal>
            </div>
        );
    }

}