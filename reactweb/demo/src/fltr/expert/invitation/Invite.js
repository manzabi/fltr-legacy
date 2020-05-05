import React from 'react';
import { connect } from 'react-redux';

import {Grid, Row, Col} from '@sketchpixy/rubix';

import {fetchJudgeInvitationSummary, putJudgeInvitation} from '../../../redux/actions/judgeInvitationActions';

import Spinner from '../../Spinner';
import Warning from '../../Warning';

import JudgeInvitationForm from './JudgeInvitationForm';

import { Entity } from '@sketchpixy/rubix/lib/L20n';

@connect((state) => state)
export default class Invite extends React.Component {

    componentDidMount() {
        // load user only first time automatically
        if (this.props.judgeInvitationSummary.item == null) {
            this.props.dispatch(fetchJudgeInvitationSummary());
        }
    }

    render() {
        return (
            <div id='judgeInvitation'>
                <Grid className="containerSection">
                    <Row>
                        <Col lg={8} lgOffset={2} md={10} mdOffset={1} xs={12} className="nopaddingMobile">
                            <Row className="sectionBordered">
                                <Col xs={12}>
                                    {this.props.judgeInvitationSummary.item && this.props.judgeInvitationSummary.item.invitation > 0 &&
                                    <span className="sectionTitle">
                                        <strong>Expert invitation</strong>: &nbsp;
                                        <Entity entity='judgeInvitationHeadline'/>
                                        <strong>{this.props.judgeInvitationSummary.item.invitation}</strong>
                                        <Entity entity='judgeInvitationHeadlineNext'/>
                                    </span>
                                    }

                                    {this.props.judgeInvitationSummary.item && this.props.judgeInvitationSummary.item.invitation == 0 &&
                                    <span className="sectionTitle">
                                        <strong>Expert invitation</strong>: &nbsp;
                                        <Entity entity='judgeInvitationHeadlineNoInvitesLeft'  />
                                    </span>
                                    }
                                </Col>
                            </Row>

                            <Row className="sectionBorderedPaddingBottom">
                                <Col xs={12}>
                                    <Grid>
                                        <JudgeInviteForm judgeInvitationSummary={this.props.judgeInvitationSummary}/>
                                    </Grid>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}



class JudgeInviteForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let judgeInvitationSummary = this.props.judgeInvitationSummary;
        // console.log("judgeInvitationSummary: " + JSON.stringify(judgeInvitationSummary));

        if (judgeInvitationSummary == null || judgeInvitationSummary.isFetching) {
            return (
                <div style={{marginLeft: 20, paddingTop: 20}}>
                    <Spinner />
                </div>
            );
        } else if (judgeInvitationSummary.isError) {
            return (
                <div style={{marginLeft: 20, paddingTop: 20}}>
                    <Warning />
                </div>
            );

        } else {
            return (
                <JudgeInvitationForm formDisabled={judgeInvitationSummary.item.invitation == 0} invitationLeft={judgeInvitationSummary.item.invitation} />
            );
        }

    }
}

