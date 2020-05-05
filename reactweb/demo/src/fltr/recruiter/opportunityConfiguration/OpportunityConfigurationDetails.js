import React, { Component } from 'react';
import CrazyField from '../../../layout/fields/CrazyFields';
import EnrichedEditor from '../../../common/components/EnrichedEditor';
import { connect } from 'react-redux';
import {
    getOpportunityById,
    getTagCategories,
    updateOpportunity
} from '../../../redux/actions/recruiterOpportunityActions';
import { Text } from '../../../layout/FluttrFonts';
import CrazyDropdown from '../../../layout/dropdown/Dropdown';
import AsynchContainer from '../../template/AsynchContainer';
import CrazyButton from '../../../layout/buttons/CrazyButtons';
import { isValidUrl } from '../../utils/FormUtils';
import {JOB_TITLE_MAX_LENGTH} from '../../../constants/fieldsLengths';

@connect(({ recruiterTagCategories }) => ({ recruiterTagCategories }))
export default class OpportunityConfigurationDetailPage extends Component {

    componentDidMount() {
        if (!this.props.recruiterTagCategories || !this.props.recruiterTagCategories.item) {
            this.props.dispatch(getTagCategories());
        }
    }
    render() {
        return (
            <AsynchContainer data={this.props.recruiterTagCategories} native>
                <OpportunityConfigurationDetail
                    opportunity={this.props.opportunity}
                    tagCategories={this.props.recruiterTagCategories.item}
                />
            </AsynchContainer>
        );
    }
}

@connect(({ dispatch }) => ({ dispatch }))
class OpportunityConfigurationDetail extends Component {

    constructor(props) {
        super(props);
        const {
            roleTitle,
            tagList,
            link: url,
            roleDescriptionHtml: roleDescription
        } = props.opportunity;
        const tagCategories = props.tagCategories;
        const positionToPush = Object.keys(tagCategories).length;
        tagCategories[positionToPush] = { id: null, category: true, value: 'other' };

        this.state = {
            formData: {
                roleTitle,
                tagList: tagList || [],
                url: url || '',
                roleDescription: roleDescription || '<p></p>\n'
            },
            formDataTemporal: {
                roleTitle,
                tagList: tagList || [],
                url: url || '',
                roleDescription: roleDescription || '<p></p>\n'
            },
            tagCategories
        };
    }

    handleChangeInput = (label, value, id) => {
        this.setState({
            formDataTemporal: {
                ...this.state.formDataTemporal,
                [id]: value
            }
        });
    };

    handleChangeDropdown = (option) => {
        const { tagCategories } = this.state;
        const categoriesArray = Object.values(tagCategories);
        const newValue = categoriesArray.find(({ value }) => value.toLowerCase() === option.text.toLowerCase());
        const tagListCopy = [...this.state.formDataTemporal.tagList];
        tagListCopy[0] = newValue;
        this.setState({
            formDataTemporal: {
                ...this.state.formDataTemporal,
                tagList: tagListCopy
            }
        });
    };

    handleChangeRichEditor = ({ content, id }) => {
        this.setState({
            formDataTemporal: {
                ...this.state.formDataTemporal,
                [id]: content
            }
        });
    };

    // handleAutoSave = () => {
    //     this.handleSubmit();
    // };

    handleSubmit = () => {
        const { id } = this.props.opportunity;
        const { roleTitle, tagList, url, roleDescription } = this.state.formData;
        const data = {
            roleTitle,
            url,
            roleDescription,
            tagList: tagList.map(({ value }) => value)
        };
        this.props.dispatch(updateOpportunity(id, data, this.onUpdateSuccess));
    };

    onUpdateSuccess = () => {
        const { id } = this.props.opportunity;
        this.props.dispatch(getOpportunityById(id));
    };

    teamOptions = () => {
        const { tagCategories } = this.state;

        // teamOptions.push({ text: 'Other', value: 'Other', id: null });

        return Object.keys(tagCategories).map((element) => {
            const { id, value } = tagCategories[element];
            let text = value.charAt(0).toUpperCase() + value.slice(1);
            if (text === 'It') { text = text.toUpperCase(); }
            return ({
                text,
                value,
                id
            });
        });
    };

    renderControls = (parameter) => {
        return (<div className='job-details-controls'>
            <CrazyButton color='white' text='Cancel' size='ceci' action={() => { this.onCancel(parameter); }} />
            <CrazyButton
                text='Save'
                size='ceci'
                className='save-button'
                action={() => { this.onSave(parameter); }}
                disabled={parameter === 'url' && !isValidUrl(this.state.formDataTemporal.url)}
            />
        </div>);
    };

    onCancel = (parameter) => {
        const newValue = this.state.formData[parameter];
        const temporalCopy = { ...this.state.formDataTemporal };
        temporalCopy[parameter] = newValue;
        this.setState({ formDataTemporal: temporalCopy });
    };

    onSave = (parameter) => {
        const newValue = this.state.formDataTemporal[parameter];
        const temporalCopy = { ...this.state.formData };
        temporalCopy[parameter] = newValue;
        this.setState({ formData: temporalCopy }, this.handleSubmit);
    };

    didTaglistsChange = () => {
        const { tagList } = this.state.formData;
        const { tagList: tagListTemporal } = this.state.formDataTemporal;
        const tagListTeam = tagList.find(({ category }) => category);
        const tagListTemporalTeam = tagListTemporal.find(({ category }) => category);
        if (!tagListTeam && tagListTemporalTeam || tagListTeam && !tagListTemporalTeam) { return true; }
        if (!tagListTeam && !tagListTemporalTeam) { return false; }
        return tagListTeam.value !== tagListTemporalTeam.value;
    };

    getTeamValue = () => {
        const team = this.state.formDataTemporal.tagList.find((category) => category);
        if (team) { return team.value; }
        return null;
    };

    render() {
        const { roleTitle, url, roleDescription } = this.state.formData;
        const { formDataTemporal } = this.state;
        const parsedTeamOptions = this.teamOptions();
        return (<div className='job-details' >
            <Text bold style={{ marginTop: 13 }}>Job position details</Text>
            <Text size='sm' className='job-details-label'>Team</Text>
            <CrazyDropdown
                options={parsedTeamOptions}
                value={this.getTeamValue()}
                placeholder='Choose your team'
                onChange={this.handleChangeDropdown}
            />
            {this.didTaglistsChange() && this.renderControls('tagList')}
            <CrazyField
                id='roleTitle'
                onFieldChange={this.handleChangeInput}
                text={formDataTemporal.roleTitle}
                maxLength={JOB_TITLE_MAX_LENGTH}
                label='Position title'
            />
            {roleTitle !== formDataTemporal.roleTitle && this.renderControls('roleTitle')}
            <CrazyField
                id='url'
                onFieldChange={this.handleChangeInput}
                text={formDataTemporal.url}
                label='Link to the job offer post'
                placeholder='Paste the link here'
                config={{
                    error: { condition: (text) => { return !isValidUrl(text); }, message: 'Wrong url' },
                    success: { condition: () => { return false; }, message: '' }
                }}
                showMessages={url !== formDataTemporal.url}
            />
            {url !== formDataTemporal.url && this.renderControls('url')}
            <Text size='sm' className='job-details-label'>Description</Text>
            <EnrichedEditor
                onChange={this.handleChangeRichEditor}
                placeholder='Text here some details about the job position related to this test'
                textareaId='roleDescription'
                value={formDataTemporal.roleDescription}
            />
            {roleDescription !== formDataTemporal.roleDescription && this.renderControls('roleDescription')}
        </div>
        );
    }
}

