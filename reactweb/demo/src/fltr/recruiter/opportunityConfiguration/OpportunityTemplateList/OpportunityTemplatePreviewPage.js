import React, { Component } from 'react';
import { connect } from 'react-redux';

import { resetTemplateData, getTemplateForOpportunity } from '../../../../redux/actions/templateActions';

import AsynchContainer from '../../../template/AsynchContainer';

import OpportunityTemplatePreviewComponent from './OpportunityTemplatePreviewComponent';


@connect((state) => state)
export default class OpportunityTemplatePreviewPage extends Component {
    constructor(props) {
        super(props);
        const { opportunity, templateId } = this.props;
        this.state = {
            opportunityId: opportunity.id,
            templateId
        };
    }
    componentDidMount() {
        this.props.dispatch(resetTemplateData(this.reloadTemplate()));
    }

    reloadTemplate = (onSuccess) => {
        const { opportunityId, templateId } = this.state;
        this.props.dispatch(getTemplateForOpportunity(opportunityId, templateId, onSuccess));
    }

    render() {
        let selectedTemplate = this.props.templateData;
        return (
            <div className={`template-preview-page ${this.props.sidebarStatus ? 'content-small' : ''}`}>
                <AsynchContainer data={selectedTemplate} manageError={false}>
                    <OpportunityTemplatePreviewComponent
                        changeTab={this.props.changeTab}
                        handleApplyTemplate={this.props.handleApplyTemplate}
                        template={selectedTemplate.item}
                        opportunityId={this.state.opportunityId}
                        templateId={this.state.templateId}
                        reloadTemplate={this.reloadTemplate}
                        opportunity={this.props.opportunity}
                    />
                </AsynchContainer>
            </div>
        );
    }
}