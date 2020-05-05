import React, {Component} from 'react';
import {connect} from 'react-redux';
import ChallengeTemplateSkillsTagsComponent from './templateEditor/ChallengeTemplateCreationComponent';

class ChallengeTemplateCreationPage extends Component {
    render () {
        const isEdit = false;
        return (
            <div className='containerMaxSize'>
                <ChallengeTemplateSkillsTagsComponent isEdit={isEdit} />
            </div>
                 
        );
    }
}

function mapStateToProps(state) {
    return({templateData: state.templateData});
}

export default connect(mapStateToProps)(ChallengeTemplateCreationPage);