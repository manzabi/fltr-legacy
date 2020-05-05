import React, { Component } from 'react';

import { connect } from 'react-redux';
import AsynchContainer from '../../../template/AsynchContainer';
import OpportunityChallengeConfigurationTemplateEditor from '../../../../layout/pages/OpportunityChallengeConfigurationTemplateEditor';
import {
    getTagCategories,
    getChallengeById,
    updateChallenge,
    resetChallengeById
} from '../../../../redux/actions/recruiterOpportunityActions';

@connect(({ recruiterChallengeById, user, recruiterTagCategories }) => ({ recruiterChallengeById, user, recruiterTagCategories }))
export default class OpportunityChallengeConfigurationTemplateEditorPage extends Component {

    componentDidMount() {
        this.props.dispatch(resetChallengeById(this.onResetOk));
        if (!this.props.recruiterTagCategories || !this.props.recruiterTagCategories.item) {
            this.props.dispatch(getTagCategories());
        }
    }

    onResetOk = () => {
        const { challengeId, changeTab } = this.props;
        if (challengeId) {
            this.props.dispatch(getChallengeById(challengeId));
        } else {
            changeTab('templates');
        }
    };

    onSave = (data, where) => {
        const { challengeId } = this.props;
        this.props.dispatch(updateChallenge(challengeId, data, () => { this.onSaveSuccess(where); }));
    };

    onSaveSuccess = (where) => {
        const { challengeId, changeTab } = this.props;
        changeTab(where, { challengeId });
    };

    render() {
        const { opportunityId, opportunity } = this.props;
        return (
            <div>
                <AsynchContainer data={this.props.recruiterChallengeById} manageError={false} native>
                    {this.props.user.item && this.props.recruiterTagCategories.item &&
                        <OpportunityChallengeConfigurationTemplateEditor
                            template={this.props.recruiterChallengeById.item}
                            onSave={this.onSave}
                            tagCategories={this.props.recruiterTagCategories.item}
                            opportunityId={opportunityId}
                            opportunity={opportunity}
                            changeTab={this.props.changeTab}
                        />
                    }
                </AsynchContainer>
            </div>
        );
    }
}