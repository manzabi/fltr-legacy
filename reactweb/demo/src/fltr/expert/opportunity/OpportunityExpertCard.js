import React from 'react';

import {
    Row,
    Col,
    Grid,
    Button,
    ButtonGroup,
    OverlayTrigger,
    Tooltip
} from '@sketchpixy/rubix';

import * as opportunityStatus from '../../../constants/opportunityStatus';

import OpportunityTimer from '../../opportunity/OpportunityTimer';
import OpportunityTags from '../../opportunity/tag/OpportunityTags';
import {goToReviewForExpert} from '../../navigation/NavigationManager';
import { getCompanyImage } from '../../utils/urlUtils';
import CrazyButton from "../../../layout/buttons/CrazyButtons";

export default class OpportunityExpertCard extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    renderShowButton () {
        return (
            <CrazyButton
            text='Show'
            size='small'
            action={() => goToReviewForExpert(this.props.data.id)}
            />
        );
    }

    renderPrimaryButton () {
        let expertDetail = this.props.data.expertDetail;
        if (expertDetail == null) {
            return (<div />);
        }
        let toReview = this.props.data.expertDetail.reviewLeft;

        // REVIEW Button
        if (toReview <= 0) {
            return this.renderShowButton();
        } else {
            return (
                <CrazyButton
                    text='Go'
                    size='small'
                    action={() => goToReviewForExpert(this.props.data.id)}
                    />
            );
        }

    }

    render () {
        let tagList = this.props.data.tagList;
        let classToReview = '';
        let expertDetail = this.props.data.expertDetail;

        let toReview = 0;
        if (expertDetail != null) {
            toReview = this.props.data.expertDetail.reviewLeft;
        }
        if (toReview > 0) {
            classToReview = 'fluttrOrange';
        }

        return (
            <Row className='opportunityItem' style={{marginTop: '20px'}}>
                <Col xs={12} >
                    <div>
                        <Grid style={{backgroundColor: 'white'}}>
                            <Row className='bordered vertical-align' style={{padding: '10px'}}>
                                <Col xs={12} md={5} style={{paddingLeft: 0, paddingRight: 0}} className='vertical-flex vertical-flex-left'>
                                    <Grid>
                                        <Row className='vertical-align'>
                                            <Col xs={12} md={12} className='header-values vertical-flex-left text-center-sm'>
                                                <span className={opportunityStatus.getClassForOpportunityStatus(this.props.data.statusId)}>
                                                    {this.props.data.statusDescription}
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row className='opportunity-row-values' style={{marginBottom: 0, marginTop: 0}}>
                                            <Col xs={12} md={12} className='text-left-md text-center-sm'>
                                                <span className='header-values-label' style={{fontWeight: 400}}>
                                                    {!this.props.data.judgeCompleted && opportunityStatus.checkTimer(this.props.data.statusId) &&
                            <OpportunityTimer key={this.props.data.id} data={this.props.data} role='expert' ends colorNormal='#333333' dayLimit={3} style={{paddingTop: 0}} />
                                                    }
                                                    {this.props.data.judgeCompleted &&
                            <div className='fluttrGreen'>
                                <span style={{fontSize: '15px'}}>Review completed </span><i className='icon-entypo-check' />
                            </div>
                                                    }
                                                </span>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </Col>
                                <Col xs={12} md={7} style={{paddingLeft: 0, paddingRight: 0}} className='vertical-flex vertical-flex-left paddingMobileTop'>
                                    <Grid>
                                        <Row className='vertical-align'>
                                            <Col xs={4} md={3} mdOffset={3} className='header-values' style={{textAlign: 'center'}}>
                                                {this.props.data.commonDetail.numberOfJudges}
                                            </Col>
                                            <Col xs={4} md={3} className='header-values' style={{textAlign: 'center'}}>
                                                {this.props.data.commonDetail.submittedChallenges}
                                            </Col>
                                            <Col xs={4} md={3} className='header-values' style={{textAlign: 'center'}}>
                                                <span className={classToReview}>{toReview}</span>
                                            </Col>
                                        </Row>
                                        <Row className='opportunity-row-values' style={{marginBottom: 0, marginTop: 0}}>
                                            <Col xs={4} md={3} mdOffset={3} style={{textAlign: 'center'}}>
                                                <span className='header-values-label'>Experts</span>
                                            </Col>
                                            <Col xs={4} md={3} style={{textAlign: 'center'}}>
                                                <span className='header-values-label'>Responses</span>
                                            </Col>
                                            <Col xs={4} md={3} style={{textAlign: 'center'}}>
                                                <span className={classToReview + ' header-values-label'}>To Review</span>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </Col>
                            </Row>
                            <Row className='vertical-align bordered'>
                                <Col xs={12} md={2} className='vertical-flex'>
                                    <div className='hidden-xs opportunity-company-logo' style={{paddingTop: 10, paddingBottom: 10}}>
                                        <img src={getCompanyImage(this.props.data.company)} />
                                    </div>
                                </Col>
                                <Col xs={12} md={5} className='vertical-flex vertical-flex-left'>

                                    <Row >
                                        <Col xs={12}>
                                            <div style={{paddingTop: 12.5, paddingBottom: 12.5}}>

                                                <div className='opportunity-company'>
                                                    <img style={{float: 'left', width: 30, marginRight: 10}} className='visible-xs' src={getCompanyImage(this.props.data.company)} />
                                                    {this.props.data.company.name}
                                                    <p style={{clear: 'both'}} />
                                                </div>

                                                <div className='opportunity-title'>
                                                    <i className='icon-entypo-briefcase icon-right-padding' />
                                                    {this.props.data.roleTitle}
                                                </div>

                                                <Row className='opportunity-row-values' style={{marginBottom: 0}}>
                                                    <Col md={12}>
                                                        <OpportunityTags taglist={tagList} hideEdit={true}/>
                                                    </Col>
                                                </Row>

                                            </div>
                                        </Col>
                                    </Row>
                                </Col>

                                <Col xs={12} md={3} className='vertical-flex paddingMobileTop'>
                                    <div className='text-center-sm text-right-md' style={{width: '100%'}}>
                                        <span className='header-values-label'>
                                        </span>
                                    </div>
                                </Col>

                                <Col xs={12} md={2} className='vertical-flex nopaddingMobileRight'>
                                    <div>
                                        {this.renderPrimaryButton()}
                                    </div>
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                </Col>
            </Row>

        );
    }

}
