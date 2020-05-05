import React, {Component} from 'react';
import {connect} from 'react-redux';


import AsynchContainer from '../../../template/AsynchContainer';

import OpportunityTemplatePreviewComponent from './OpportunityTemplatePreviewComponent';
import { getChallengeTemplateForOpportunity, resetChallengeTemplateData } from '../../../../redux/actions/templateActions';

@connect((state) => state)
export default class OpportunityChallengePreviewPage extends Component {
    componentDidMount () {
        const {opportunityId, challengeId} = this.props;
        this.props.dispatch(resetChallengeTemplateData(this.reloadChallenge(opportunityId, challengeId)));
    }
    
    reloadChallenge(opportunityId, challengeId){
        this.props.dispatch(getChallengeTemplateForOpportunity(opportunityId, challengeId));
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.challengeId !== this.props.challengeId) {
            const {opportunityId, challengeId} = nextProps;
            this.props.dispatch(resetChallengeTemplateData(this.reloadTemplate(opportunityId, challengeId)));
        }
    }

    render () {
        let selectedTemplate = this.props.challengeTemplateData;
        if (selectedTemplate.item) {
            const {seniorityLevel, seniorityLevelString, tagList} = selectedTemplate.item;
            const {contentHtml} = selectedTemplate.item.challenge;
            selectedTemplate.item.challenge = {
                ...selectedTemplate.item.challenge,
                seniorityLevel,
                seniorityLevelString,
                tagList,
                summary: contentHtml

            };
        }        
        return (
            <div className={`template-preview-page ${this.props.sidebarStatus ? 'content-small' : ''}`}>
                <AsynchContainer data={selectedTemplate} manageError={false}>
                    <OpportunityTemplatePreviewComponent
                        handleReinicialize={this.props.handleReinicialize}
                        handleApplyTemplate={this.props.handleApplyTemplate}
                        template={selectedTemplate.item && selectedTemplate.item.challenge}
                        opportunityId={this.props.opportunityId}
                        handleLoad={this.props.handleLoad}
                        loading={this.props.loading}
                    />
                </AsynchContainer>
            </div>
        );
    }
}