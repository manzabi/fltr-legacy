import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    getTagCategories,
    getSkillsByTeamId,
    resetGetTemplatesByCriteria,
    getTemplatesByCriteria,
    createOpportunity,
    useChallenge,
    getOpportunityById,
    getAllSkills
} from '../../../redux/actions/recruiterOpportunityActions';
import { fetchOpportunitiesCompleteTagList } from '../../../redux/actions/opportunityActions';
import AsynchContainer from '../../template/AsynchContainer';
import { goToRecruiterDashboard, goToRecruiterConfigure, scrollFix, replaceToRecruiterConfigure } from '../../navigation/NavigationManager';
import {
    getOpportunityOldChallenges,
    opportunityApplyTemplate, resetOpportunityOldChallenges
} from '../../../redux/actions/templateActions';
import { getAllSeniorityLevels, MID_LEVEL } from '../../../constants/senioritylevel';
import Grid from '../../../layout/layout/Grid';
import { Header, Text } from '../../../layout/FluttrFonts';
import CrazySearchBar from '../../../layout/searchbar/Searchbar';
import CrazyDropdown from '../../../layout/dropdown/Dropdown';
import Container from '../../../layout/layout/Container';
import Row from '../../../layout/layout/Row';
import CrazyButton from '../../../layout/buttons/CrazyButtons';
import Col from '../../../layout/layout/Col';
import CrazyIcon from '../../../layout/icons/CrazyIcon';
import RecruiterCrazyModal from '../../../layout/modal/RecruiterCrazyModal';
import CrazyField from '../../../layout/fields/CrazyFields';
import Offset from '../../../layout/layout/Offset';
import CrazyTooltip from '../../../layout/uiUtils/tooltip';
import { manageErrorMessage } from '../../../common/utils';
import Spinner from '../../Spinner';
import { checkUserUpdate } from '../../../redux/actions/userActions';
import { isCompletedJobPost } from '../../../constants/opportunityStatus';
import * as ga from '../../../constants/analytics';
import ContextMenu from '../../../common/components/ContextMenu';
import SectionContainer from '../../../common/components/dummy/SectionContainer';
import { getOpportunityChallengeSelected } from '../../../constants/opportunityChallengeProcessStatus';
import FeatureNotAvailable from '../../../routes/common/FeatureNotAvailable';
import { getAttitudeProcessTest, getChallengeProcessTest } from '../../../constants/opportunityProcessType';
import {JOB_TITLE_MAX_LENGTH} from '../../../constants/fieldsLengths';

@connect(({
    user,
    opportunitiesCompleteTagList,
    recruiterTagCategories
}) => ({
    user,
    opportunitiesCompleteTagList,
    recruiterTagCategories
}))
export default class RecruiterTemplatePage extends Component {

    componentDidMount() {
        if (!this.props.recruiterTagCategories || !this.props.recruiterTagCategories.item) {
            this.props.dispatch(getTagCategories());
        }
        this.props.dispatch(fetchOpportunitiesCompleteTagList());
    }

    render() {
        if (this.props.user.item && this.props.opportunitiesCompleteTagList.item && this.props.recruiterTagCategories.item) {
            return (
                <ChooseTemplate
                    changeTab={this.props.changeTab}
                    user={this.props.user.item}
                    tagCategories={this.props.recruiterTagCategories.item}
                    completeTagList={this.props.opportunitiesCompleteTagList.item}
                    isCreate={this.props.isCreate}
                    opportunity={this.props.opportunity}
                    context={this.props.context}
                />
            );
        } else {
            return <Spinner />;
        }
    }
}

@connect(({
    opportunityChallengesOld,
    recruiterTagSkillsById,
    recruiterTemplatesByCriteria
}) => ({
    opportunityChallengesOld,
    recruiterTagSkillsById,
    recruiterTemplatesByCriteria
}))
class ChooseTemplate extends Component {

    constructor(props) {
        super(props);
        const { opportunity, tagCategories } = props;
        const tagCategoriesCopy = { ...tagCategories };
        tagCategoriesCopy[tagCategoriesCopy.length] = { text: 'Other', value: 'other', id: null };
        let selectedTeamKey;
        if (opportunity) {
            selectedTeamKey = Object.keys(tagCategoriesCopy).find(number => tagCategoriesCopy[number].value === opportunity.tagString);
        } else { selectedTeamKey = Object.keys(tagCategoriesCopy).find(number => tagCategoriesCopy[number].defaultValue); }
        const selectedTeam = selectedTeamKey ? tagCategoriesCopy[selectedTeamKey] : null;
        const showGoToLibrary = opportunity && !isCompletedJobPost(opportunity.statusId) || false;
        this.state = {
            selectedSkills: [],
            selectedTeam,
            selectedSeniority: null,
            isCreate: props.isCreate,
            myTestSubtitle: 'This is the selected challenge to test your candidates.',
            showGoToLibrary,
            context: props.context
        };
    }

    componentDidMount() {
        this.updateOnChangeTab();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.context !== this.props.context) {
            this.setState({
                context: nextProps.context
            }, () => {
                if (['my_test', 'templates', 'challenges'].includes(nextProps.context)) {
                    this.updateOnChangeTab();
                }
            });
        }
    }

    updateOnChangeTab = () => {
        const { selectedTeam, isCreate } = this.state;
        if (selectedTeam) {
            if (selectedTeam.id) {
                this.props.dispatch(getSkillsByTeamId(selectedTeam.id));
            } else {
                this.props.dispatch(getAllSkills());
            }
            this.updateTemplateList();
        }
        if (isCreate) {
            this.setState({ createModalStatus: true }, () => {
                ga.track(ga.OPPORTUNITY_CHALLENGE_CREATION_START);
            });
        }

        if (!selectedTeam && !isCreate && this.props.opportunity.recruiterDetail.challengeTest) {
            this.updateTemplateList();
        }
    };

    onSelectSkill = (skill, emptyField) => {
        const { selectedSkills } = this.state;
        const selectedSkillsCopy = [...selectedSkills];
        const isSelected = selectedSkills.map(element => element.id).indexOf(skill.id);
        if (isSelected > -1) {
            selectedSkillsCopy.splice(isSelected, 1);
        } else {
            selectedSkillsCopy.push(skill);
        }

        this.setState({ selectedSkills: selectedSkillsCopy }, () => { if (emptyField) { emptyField(); } this.updateTemplateList(); });
    };

    renderSkill = (skill, emptyField, prefix = '') => {
        if (skill) {
            const { selectedSkills } = this.state;
            const isSelected = selectedSkills.find(element => element.id === skill.id);
            let className = 'skill';
            className += prefix;
            if (isSelected || skill.id === undefined) { className += ' selected'; }
            return (
                <div className={className} onClick={(isSelected || skill.id === undefined) ? () => { return; } : () => { this.onSelectSkill(skill, emptyField); }}>
                    <span>{skill.value}</span>
                    <div className='cross-in-circle' onClick={() => { this.onSelectSkill(skill); }}><CrazyIcon icon='icon-cancel' /></div>
                </div>
            );
        }
    };

    renderSkillForTemplate = (skill) => {
        if (skill) {
            const { value } = skill;
            return (<div className='template-skill'>
                <span>{value}</span>
            </div>);
        }
    };

    goToPreview = (challengeId) => {
        this.props.changeTab('preview', { challengeId });
    };

    onAddChallenge = () => {
        this.props.changeTab('templates');
    };

    renderTemplate = (template) => {
        if (template === 'attitude') {
            return (
                <Col key={template} lg='3' md='4' sm='6' className='template my-challenges attitude'>
                    <div className='box'>
                        <Text bold className='crazy-darkside'>Attitude test</Text>
                    </div>
                    <div className='template-buttons-wrapper'>
                        <div className='selected-text'><Text size='sm' bold>Selected</Text></div>
                    </div>
                </Col>
            );
        }
        if (template) {
            const { context, opportunity } = this.props;
            const { title, cover, tagList, seniorityLevelString, id, locked, draft } = template.template || template.challenge;
            const allSkills = tagList.map(({ value }) => ({ value }));
            let skills;
            if (allSkills.length < 4) {
                skills = allSkills;
            } else {
                skills = allSkills.slice(0, 3);
                skills.push({ value: '+' + (allSkills.length - 3) });
            }
            if (context === 'challenges') {
                return (
                    <Col key={`tem_${id}`} lg='3' md='4' sm='6' className='template my-challenges'>
                        <div
                            className='box'
                            style={{
                                background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${cover && cover.url || ''})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                            onClick={() => {
                                if (template.challenge && template.challenge.id) { this.goToPreview(template.challenge.id, opportunity.id); }
                            }}
                        >
                            {seniorityLevelString !== 'undefined' && <Text size='sm' bold>{seniorityLevelString}</Text>}
                            <Header style={{ fontSize: 15 }}>{title}</Header>
                            <div className='template-skills-wrapper' id={`template-skills-${id}`} key={`template-skills-${id}`}>
                                {skills.map(skill => this.renderSkillForTemplate(skill))}
                            </div>
                        </div>
                        <div className='template-buttons-wrapper'>
                            {opportunity && opportunity.recruiterDetail && opportunity.recruiterDetail.challengeTest && opportunity.recruiterDetail.challengeTest.challenge && opportunity.recruiterDetail.challengeTest.challenge.id === id ?
                                <div className='selected-text'><Text size='sm' bold>Selected</Text></div> :
                                !draft ? <CrazyButton size='ceci' text='Use' action={() => { this.onUseChallenge(id); }} /> :
                                    <CrazyButton size='ceci' inverse text='Edit draft' action={() => { this.onEditChallenge(id); }} />}
                            <div className='icons-wrapper'>
                                <ContextMenu
                                    buttonClassname='fas fa-ellipsis-v'
                                    items={
                                        [
                                            { text: 'Edit challenge', onclick: () => { this.onEditChallenge(id); } }
                                        ]
                                    }
                                />
                            </div>
                        </div>
                    </Col>
                );
            } else if (context === 'my_test') {
                if (opportunity && opportunity.recruiterDetail && opportunity.recruiterDetail.challengeTest && opportunity.recruiterDetail.challengeTest.challenge && opportunity.recruiterDetail.challengeTest.challenge.id === id) {
                    return (
                        <Col lg='3' md='4' sm='6' className='template my-challenges'>
                            <div
                                className='box'
                                style={{
                                    background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${cover && cover.url || ''})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                                onClick={() => {
                                    if (template.challenge && template.challenge.id) { this.goToPreview(template.challenge.id, opportunity.id, true); }
                                }}
                            >
                                {seniorityLevelString !== 'undefined' && <Text size='sm' bold>{seniorityLevelString}</Text>}
                                <Header style={{ fontSize: 15 }}>{title}</Header>
                                <div className='template-skills-wrapper'>
                                    {skills.map(skill => this.renderSkillForTemplate(skill))}
                                </div>
                            </div>
                            <div className='template-buttons-wrapper'>
                                {opportunity && opportunity.recruiterDetail && opportunity.recruiterDetail.challengeTest && opportunity.recruiterDetail.challengeTest.challenge && opportunity.recruiterDetail.challengeTest.challenge.id === id ?
                                    <div className='selected-text'><Text size='sm' bold>Selected challenge</Text></div> :
                                    !draft ? <CrazyButton size='ceci' text='Use' action={() => { this.onUseChallenge(id); }} /> :
                                        <CrazyButton size='ceci' inverse text='Edit draft' action={() => { this.onEditChallenge(id); }} />}
                                <div className='icons-wrapper'>
                                    {/* <CrazyIcon icon='icon-edit' onClick={() => { this.onEditChallenge(id); }} /> */}
                                    {/* Faltan los puntitos */}
                                </div>
                            </div>
                        </Col>
                    );
                }
            } else {
                return (
                    <Col lg='3' md='4' sm='6' className='template'>
                        <div
                            className='box'
                            style={{
                                background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${cover && cover.url || ''})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                            onClick={() => { this.onTemplateClick(id); }}
                        >
                            {!locked && <CrazyIcon icon='icon-unlock-alt' />}
                            <Text size='sm' bold>{seniorityLevelString}</Text>
                            <Header style={{ fontSize: 15 }}>{title}</Header>
                            <div className='template-skills-wrapper'>
                                {skills.map(skill => this.renderSkillForTemplate(skill))}
                            </div>
                        </div>
                    </Col>
                );
            }
        } else if (template === null) {
            const { context } = this.props;
            if (context !== 'my_test') {
                return (
                    <Col lg='3' md='4' sm='6' className='template'>
                        <div className='box empty' onClick={this.onCreateChallenge}>
                            <CrazyIcon icon='icon-plus-thin' />
                            <Text size='sm'>Start from scratch</Text>
                        </div>
                        <Text size='sm' className='no-results-subtitle' style={{ fontSize: 12 }}>Got your own idea? <br /> Start with a clean slate.</Text>
                    </Col>
                );
            } else {
                return (
                    <Col lg='3' md='4' sm='6' className='template'>
                        <div className='box empty' onClick={this.onAddChallenge}>
                            <CrazyIcon icon='icon-plus-thin' />
                            <Text size='sm'>Add challenge</Text>
                        </div>
                        <Text size='sm' className='no-results-subtitle' style={{ fontSize: 12 }}>Add a challenge to prove the candidate skills for your job position. Pick one from the template library or create your own from scratch.</Text>
                    </Col>
                );
            }
        } else {
            return (
                <Col lg='3' md='4' sm='6' className='template'>
                    <div className='box empty' onClick={this.onRequestTemplate}>
                        <CrazyIcon icon='icon-request' />
                        <Text size='sm'>Request a template</Text>
                    </div>
                    <Text size='sm' className='no-results-subtitle'>Don't find the perfect template? <br /> We will create one especially for you</Text>
                </Col>
            );
        }
    };

    onTemplateClick = (id) => {
        this.props.changeTab('preview', { templateId: id });
    };

    onUseChallenge = (id) => {
        const { id: opportunityId } = this.props.opportunity;
        this.props.dispatch(useChallenge(opportunityId, { challengeId: id }, () => {
            this.updateTemplateList();
            this.props.dispatch(getOpportunityById(opportunityId));
            goToRecruiterConfigure(opportunityId, 'my_test');
        }, () => {
            manageErrorMessage('ErrorUseChallenge', 'Something happened');
        }));
    };

    onEditChallenge = (id) => {
        this.props.changeTab('edit', { challengeId: id });
    };

    onCreateChallenge = () => {
        const { id } = this.props.opportunity;
        this.props.dispatch(opportunityApplyTemplate(id, null, this.onCreateSuccess));
    };

    onCreateSuccess = (response) => {
        this.props.changeTab('edit', { challengeId: response.id });
        scrollFix();
    };

    teamOptions = () => {
        const { tagCategories } = this.props;
        const teamOptions = Object.keys(tagCategories).map((element) => {
            const { id, value } = tagCategories[element];
            let text = value.charAt(0).toUpperCase() + value.slice(1);
            if (text === 'It') { text = text.toUpperCase(); }
            return ({
                text,
                value,
                id
            });
        });

        teamOptions.push({ text: 'Other', value: 'other', id: null });

        return teamOptions;
    };

    onTeamDropdownChange = (team) => {
        if (team.id) {
            this.props.dispatch(getSkillsByTeamId(team.id));
        } else {
            this.props.dispatch(getAllSkills());
        }

        this.setState({ selectedTeam: team },
            this.updateTemplateList
        );
    };

    onLevelDropdownChange = ({ id: selectedSeniority }) => {
        this.setState({ selectedSeniority },
            this.updateTemplateList
        );
    };

    updateTemplateList = () => {
        const { context } = this.state;
        const id = this.props.opportunity && this.props.opportunity.id || null;
        const { selectedSkills, selectedTeam, selectedSeniority } = this.state;
        const skills = selectedSkills.map(ele => ele.key);

        let skillsToSearch = skills;
        if (selectedTeam) {
            skillsToSearch = skills.concat(selectedTeam.value);
        }

        const form = {
            seniorityLevel: selectedSeniority,
            skills: skillsToSearch
        };
        if (form.seniorityLevel === null) { delete form.seniorityLevel; }
        if (context === 'challenges' || context === 'my_test') {
            this.props.dispatch(resetOpportunityOldChallenges(() => {
                this.props.dispatch(getOpportunityOldChallenges(id, form));
            }));
        } else {

            this.props.dispatch(resetGetTemplatesByCriteria(() => {
                this.props.dispatch(getTemplatesByCriteria(form));
            }));
        }

    };

    getSearchBarOptions = () => {
        const skills = this.props.recruiterTagSkillsById.item;
        if (!skills) { return []; }
        const arrayofSkills = Object.values(skills);
        arrayofSkills.forEach(skill => {
            skill.text = skill.value;
        });
        return arrayofSkills;
    };

    resetFilters = () => {
        const { tagCategories, opportunity } = this.props;
        let selectedTeamKey;
        if (opportunity) {
            selectedTeamKey = Object.keys(tagCategories).find(number => tagCategories[number].value === opportunity.tagString);
        } else { selectedTeamKey = Object.keys(tagCategories).find(number => tagCategories[number].defaultValue); }
        const selectedTeam = selectedTeamKey ? tagCategories[selectedTeamKey] : null;
        this.setState({
            selectedSkills: [],
            selectedTeam,
            selectedSeniority: null
        }, this.updateTemplateList);
    };

    closeSearchBarTeam = () => {
        this.setState({
            selectedTeam: null
        }, this.updateTemplateList);
    };

    onRequestTemplate = () => {
        this.props.changeTab('request_template');
    };

    renderSearchBarChildren = (options, text, emptyField) => {
        const { selectedTeam } = this.state;
        if (!selectedTeam) {
            const teamOptions = this.teamOptions();
            return (<div className='searchbar-children-wrapper no-team'>
                <div className='team-title'><Text>CATEGORIES</Text></div>
                {teamOptions.map(option => <div className='team-option' key={option.id} onClick={() => { this.onTeamDropdownChange(option); }}><Text>{option.text.toUpperCase()}</Text></div>)}
            </div>);
        }
        return (<div className='searchbar-children-wrapper'>
            <div className='selected-team-searchbar'>
                <Text>{selectedTeam.text && selectedTeam.text.toUpperCase() || selectedTeam.value && selectedTeam.value.toUpperCase()}</Text> <CrazyIcon icon='icon-cancel' onClick={this.closeSearchBarTeam} className='searchbar-close' />
            </div>
            <SkillsContainer
                renderSkill={this.renderSkill}
                skills={options}
                emptyField={emptyField}
                prefix=' searchbar'
            />
            {text.length > 0 && <div className='create-tag-text' onClick={() => { this.onRequestTag(text, emptyField); }}>
                <CrazyIcon icon='icon-plus-thin' /><Text bold style={{ fontSize: 12 }}>Create tag for “{text}”</Text>
            </div>}
        </div>);
    };

    onRequestTag = (text, emptyField) => {
        const { selectedSkills } = this.state;
        if (!text.length || selectedSkills.find(skill => skill.value === text)) { return; }
        const newSkills = [...selectedSkills];
        newSkills.push({ value: text, key: text, text });
        this.setState({ selectedSkills: newSkills }, emptyField);
    };

    onClose = () => {
        const { opportunity } = this.props;
        const hasChallangeSelected = getOpportunityChallengeSelected(opportunity);
        if (hasChallangeSelected) {
            goToRecruiterConfigure(opportunity.id, 'my_test');
        } else {
            goToRecruiterDashboard();
        }
    };

    render() {
        const teamOptions = this.teamOptions();
        const seniorityLevels = getAllSeniorityLevels();
        const levelOptions = seniorityLevels.map(({ id, description: text }) => ({ id, text }));
        levelOptions.unshift({ id: MID_LEVEL.id, text: 'All Levels' });
        const searchBarOptions = this.getSearchBarOptions();

        const { selectedTeam, selectedSkills, selectedSeniority } = this.state;

        const { context } = this.props;
        let objectStored;
        switch (context) {
            case 'challenges':
                objectStored = this.props.opportunityChallengesOld;
                break;
            case 'my_test':
                objectStored = this.props.opportunityChallengesOld;
                break;
            default:
                objectStored = this.props.recruiterTemplatesByCriteria;
        }

        if (context === 'my_test') {
            const hasAttitude = getAttitudeProcessTest(this.props.opportunity);
            const hasChallenge = getChallengeProcessTest(this.props.opportunity);
            if (hasAttitude && hasChallenge) {
                return (
                    <SectionContainer className='choose-template my-test'>
                        <Header className='title' size='sm'>Your selection</Header>
                        <Text style={{ margin: 0 }} size='sm'>{this.state.myTestSubtitle}</Text>
                        <AsynchContainer data={objectStored} native>
                            <TemplatesContainer
                                renderTemplate={this.renderTemplate}
                                templates={objectStored.item}
                                resetFilters={this.resetFilters}
                                context={context}
                                opportunity={this.props.opportunity}
                                withAttitude
                            />
                        </AsynchContainer>
                        {this.state.showGoToLibrary ?
                            <Text style={{ margin: '40px 0', fontSize: 12 }}>
                                Want to change your selection? <a className='go-to-library' onClick={() =>  goToRecruiterConfigure(this.props.opportunity.id,'challenges')}>Go to library</a>
                            </Text> : null}
                    </SectionContainer>
                );
            } else if (hasAttitude) {
                return (
                    <SectionContainer className='choose-template my-test'>
                        <Header className='title' size='sm'>Your selection</Header>
                        <Text style={{ margin: 0 }} size='sm'>This is the soft skills test to evaluate your candidates.</Text>
                        <Row className='template-list'>
                            {this.renderTemplate('attitude')}
                        </Row>
                    </SectionContainer>
                );
            } else {
                return (
                    <SectionContainer className='choose-template my-test'>
                        <Header className='title' size='sm'>Your selection</Header>
                        <Text style={{ margin: 0 }} size='sm'>{this.state.myTestSubtitle}</Text>
                        <AsynchContainer data={objectStored} native>
                            <TemplatesContainer
                                renderTemplate={this.renderTemplate}
                                templates={objectStored.item}
                                resetFilters={this.resetFilters}
                                context={context}
                                opportunity={this.props.opportunity}
                            />
                        </AsynchContainer>
                        {this.state.showGoToLibrary ?
                            <Text style={{ margin: '40px 0', fontSize: 12 }}>
                                Want to change your selection? <a className='go-to-library' onClick={() =>  goToRecruiterConfigure(this.props.opportunity.id,'challenges')}>Go to library</a>
                            </Text> : null}
                    </SectionContainer>
                );
            }
        }
        return (
            <FeatureNotAvailable manageUiFix={false}>
                <Container className='choose-template'>
                    <div className='close-button-wrapper'>
                        <Text size='sm' onClick={this.onClose} className='close-button' >Close</Text>
                    </div>
                    <Grid style={{ margin: 'auto' }}>
                        <Header size='sm' className='title'>{context === 'challenges' ? 'My challenges' : 'Challenge templates'}</Header>
                        <Text size='sm'>{context === 'challenges' ? 'Select or edit one of your challenges to use it for this test' : 'Use a challenge to test candidates skills and talent.'}</Text>
                        <Grid className='challenge-filter-wrapper'>
                            <Col sm='2'>
                                <CrazyDropdown
                                    placeholder='CHOOSE LEVEL'
                                    defaultText='All Levels'
                                    options={levelOptions}
                                    onChange={this.onLevelDropdownChange}
                                    className='level-dropdown'
                                    resetIf={selectedSeniority === undefined}
                                />

                            </Col>
                            <Col sm='4'>
                                <CrazyTooltip
                                    position='bottom'
                                    messageChildren={<Text style={{ fontSize: 11, textAlign: 'center' }} bold className='team-tooltip'>Select a team to see our customizable templates</Text>}
                                    show={selectedTeam === null}
                                    stayHiddenIf={() => { return !!document.getElementsByClassName('options-wrapper').length; }}
                                    hideOnChildrenClick
                                    block
                                    width='200px'
                                    color='darkside'
                                >
                                    <CrazyDropdown
                                        placeholder='SELECT TEAM'
                                        options={teamOptions}
                                        onChange={this.onTeamDropdownChange}
                                        className='team-dropdown'
                                        value={selectedTeam && selectedTeam.value}
                                        resetIf={selectedTeam === null}
                                    />
                                </CrazyTooltip>
                            </Col>
                            <Col sm='4'>
                                <CrazyTooltip
                                    position='bottom'
                                    messageChildren={<Text style={{ fontSize: 11, textAlign: 'center' }} bold className='team-tooltip'>Type skills to see related challenge templates</Text>}
                                    show={selectedTeam && selectedTeam.id === null}
                                    stayHiddenIf={() => { return !!document.getElementsByClassName('searchbar-children-wrapper').length; }}
                                    hideOnChildrenClick
                                    block
                                    width='200px'
                                    color='darkside'
                                >
                                    <CrazySearchBar
                                        placeholder='SEARCH BY SKILLS'
                                        options={searchBarOptions}
                                        renderChildren={this.renderSearchBarChildren}
                                        onChange={() => { return; }}
                                        childrenHeight={!selectedTeam ? (teamOptions.length < 5 ? teamOptions.length * 42 : 4 * 42) : '200px'}
                                        openIfText
                                        backdropClasses={['searchbar', 'searchbar-children-wrapper', 'create-tag-text', 'team-option', 'searchbar-close']}
                                        stayOpenOnChange
                                        openOnFocus
                                        maxLength={18}
                                    />
                                </CrazyTooltip>
                            </Col>
                            <Offset smOffset='1' />
                            <Col sm='1'>
                                <Text
                                    size='sm'
                                    className={`reset-filters${!selectedSkills.length ? ' disabled' : ''}`}
                                    onClick={() => { if (selectedSkills.length) { this.resetFilters(); } }}
                                >reset filters</Text>
                            </Col>
                        </Grid>
                        {!!(selectedSkills.length || selectedTeam) &&
                            <AsynchContainer data={this.props.recruiterTagSkillsById} native>
                                <SkillsContainer
                                    renderSkill={this.renderSkill}
                                    skills={selectedSkills}
                                    isOther={selectedTeam && selectedTeam.id === null}
                                />
                            </AsynchContainer>
                        }
                        <AsynchContainer data={objectStored} native>
                            <TemplatesContainer
                                renderTemplate={this.renderTemplate}
                                templates={objectStored.item}
                                checkIfNoItems
                                resetFilters={this.resetFilters}
                            />
                        </AsynchContainer>
                    </Grid>
                    <Footer onRequestTemplate={this.onRequestTemplate} />
                    {this.state.createModalStatus &&
                        <CreateOpportunityModal
                            createModalStatus={this.state.createModalStatus}
                            teamOptions={teamOptions}
                            selectedTeam={selectedTeam}
                        />
                    }
                </Container>
            </FeatureNotAvailable>
        );
    }
}

@connect(({ userStatus }) => ({ userStatus }))
class CreateOpportunityModal extends Component {
    constructor(props) {
        super(props);
        const defaultValue = props.selectedTeam && props.selectedTeam.value || 'Choose an option';
        this.state = {
            mainSkill: defaultValue,
            title: '',
            loading: false
        };
    }

    handleCreateOpportunity = () => {
        this.setState({ loading: true });
        const { mainSkill, title } = this.state;
        const valid = [mainSkill, title].every((value) => value && value.trim());
        if (valid) {
            const data = {
                mainSkill, title
            };
            this.props.dispatch(createOpportunity(data, this.onCreateOk, this.onCreateError));
        } else { this.setState({ loading: false }); }
    };
    onCreateOk = ({ id }) => {
        this.setState({ loading: false }, () => {
            ga.track(ga.OPPORTUNITY_CHALLENGE_CONFIGURATION_START);
        });
        this.props.dispatch(checkUserUpdate(this.props.userStatus, true));
        replaceToRecruiterConfigure(id, 'templates');
    };
    onCreateError = (error) => {
        this.setState({ loading: false }, () => {
            ga.track(ga.OPPORTUNITY_CHALLENGE_CONFIGURATION_START_ERROR);
            goToRecruiterDashboard();
        });
    };

    handleChangeTitle = (label, value) => {
        this.setState({
            title: value
        });
    };

    handleSelectSkill = ({ value }) => {
        this.setState({
            mainSkill: value
        });
    };
    render() {
        const { createModalStatus, teamOptions } = this.props;
        return (
            <RecruiterCrazyModal
                show={createModalStatus}
                onCloseButton={goToRecruiterDashboard}
                title='Test configuration'
                className='create-challenge-modal'
                size='md'
            >
                <Grid className='content'>
                    <Text size='sm' className='job-title'>What job position is the test related to?</Text>
                    <Text size='sm' className='team-label'>Team</Text>
                    <Col>
                        <CrazyDropdown
                            options={teamOptions}
                            onChange={this.handleSelectSkill}
                            defaultText={this.state.mainSkill}
                        />
                    </Col>
                    <CrazyField
                        label='Position title'
                        onFieldChange={this.handleChangeTitle}
                        text={this.state.title}
                        placeholder='Text position title'
                        maxLength={JOB_TITLE_MAX_LENGTH}
                        config={{
                            error: { condition: () => false, message: '' },
                            success: { condition: (text) => { return !!text.trim().length; }, message: '' }
                        }}
                        showMessages
                        enterAction={() => { if (this.state.title.length && this.state.mainSkill !== 'Choose an option') { this.handleCreateOpportunity(); } }}
                    />
                    <CrazyButton
                        action={this.handleCreateOpportunity}
                        text='Next'
                        size='ceci'
                        loading={this.state.loading}
                        disabled={!this.state.title.trim().length || this.state.mainSkill === 'Choose an option'}
                    />
                </Grid>
            </RecruiterCrazyModal >
        );
    }
}

const SkillsContainer = ({ skills, isOther, emptyField, prefix, renderSkill }) => {
    if (isOther) {
        return (
            <div className='skills-wrapper' />
        );
    }
    return (
        <div className='skills-wrapper'>
            {Object.keys(skills).map(number => renderSkill(skills[number], emptyField, prefix))}
        </div>
    );
};

const TemplatesContainer = ({ templates: { content }, checkIfNoItems, context, opportunity, renderTemplate, withAttitude }) => {
    const renderNoContent = checkIfNoItems && !content.length;
    if (context === 'my_test') {
        let newContent = null;
        content.forEach(element => {
            if (opportunity && opportunity.recruiterDetail && opportunity.recruiterDetail.challengeTest && opportunity.recruiterDetail.challengeTest.challenge && opportunity.recruiterDetail.challengeTest.challenge.id === element.challenge.id) {
                newContent = element;
                return;
            }
        });
        if (newContent) {
            if (withAttitude) {
                return (
                    <Row className='template-list'>
                        {[newContent, 'attitude'].map(template => renderTemplate(template))}
                    </Row>
                );
            }
            return (
                <Row className='template-list'>
                    {renderTemplate(newContent)}
                </Row>
            );
        } else {
            return (
                <Row className='template-list'>
                    {renderTemplate(null)}
                </Row>
            );
        }
    }
    if (renderNoContent) {
        return (
            <Row className='no-content-template-list'>
                <CrazyIcon icon='icon-search' className='lens' />
                <Text className='oops'>Oops! There are no templates with this criteria</Text>
                <div style={{ margin: '20px auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 510 }}>
                    {renderTemplate(null)}
                    {renderTemplate()}
                </div>
            </Row>
        );
    } else {
        return (
            <Row className='template-list'>
                {[null, ...content].map(template => renderTemplate(template))}
            </Row>
        );
    }
};

const Footer = ({ onRequestTemplate }) => {
    return (
        <div className='choose-template-footer'>
            <Text size='sm'>Don't find the perfect template? Let us know and we will create one especially for you</Text>
            <Text bold onClick={onRequestTemplate} size='sm' className='request'>Request a template</Text>
        </div>
    );
};