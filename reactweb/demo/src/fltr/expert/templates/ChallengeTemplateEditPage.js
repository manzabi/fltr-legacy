import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import ChallengeTemplateSkillsTagsComponent from './templateEditor/ChallengeTemplateCreationComponent';

import AsynchContainer from '../../template/AsynchContainer';

import * as templateActions from '../../../redux/actions/templateActions';

class ChallengeTemplateEditPage extends Component {
    componentDidMount () {
        this.props.dispatch(templateActions.resetTemplateData(this.onResetOk));
    }
    onResetOk = () => {
        const id = this.props.params.id;
        this.props.dispatch(templateActions.getTemplateById(id));
    }
    render () {
        const isEdit = true;
        let objectStored = this.props.templateData;
        return (
            <div className='containerMaxSize'>
                <AsynchContainer data={objectStored} manageError={false} >
                    <ChallengeTemplateSkillsTagsComponent isEdit={isEdit} data={objectStored.item} />
                </AsynchContainer>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return({templateData: state.templateData});
}

function mapDispatchToProps (dispatch) {
    return {
        templateActions: bindActionCreators(templateActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeTemplateEditPage);