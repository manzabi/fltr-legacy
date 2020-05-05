import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {fetchOpportunitiesCompleteTagList} from '../../redux/actions/opportunityActions';

import {manageErrorMessage} from '../utils';

import {
    Badge
} from '@sketchpixy/rubix';

/**
 * @param handleChangeTags: PropTypes.func.isRequired,
 * @param handleSelectCategory: PropTypes.func.isRequired,
 * @param skills: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired
 */

@connect((state) => state)
export default class SkillsInputComponent extends Component {
    constructor (props) {
        super(props);
        let tags = [];
        if (props.skills) tags = [...props.skills];
        this.state = {
            currentTag: '',
            tags: tags,
            recomendedTags: [],
            showSugestions: false
        };
    }
    componentDidMount () {
        if (this.props.opportunitiesCompleteTagList.item === (null || undefined)){
            this.props.dispatch(fetchOpportunitiesCompleteTagList());
        }
        window.addEventListener('click', this.handleClickSugestions);
    }

    componentWillReceiveProps (newProps) {
        if (newProps.skills) {
            this.setState({
                tags: [...newProps.skills]
            });
        }
    }

    handleClickSugestions = (event) => {
        if (event.target.dataset && event.target.dataset.type !== 'skillSelection') {
            this.setState({
                showSugestions: false
            });
        }
    }

    handleRemoveTag = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const tagToRemove = event.target.id;
        const {tags} = this.state;
        const newTags = tags.filter((tag) => tag.value !== tagToRemove);
        this.props.handleChangeTags(newTags);
        this.setState({
            tags: newTags
        });
    }
    handleChange = (event) => {
        event.preventDefault();
        const value = event.target.value;
        let tags;
        if (value && value.trim()) {
            const tagRecomendations = window.Object.values(this.props.opportunitiesCompleteTagList.item);
            tags = tagRecomendations.filter((tag) => {
                if (tag) {
                    return tag.value.includes(value.toLowerCase());
                }
            });
        } else {
            tags = [];
        }
        this.setState({
            recomendedTags: tags,
            currentTag: value,
            showSugestions: true
        });
    }
    handleAutoComplete = (tag) => {
        const skill = {
            value: tag.value,
            isCategory: tag.category
        };
        if (skill.isCategory) {
            this.props.handleSelectCategory(tag);
        } else {
            this.props.handleChangeTags([...this.state.tags, skill]);
        }
        this.setState({
            currentTag: '',
            showSugestions: false
        });
    }
    handleSubmitTag = (target) => {
        const skill = target.value.toLowerCase();
        if (target.value.length >= 2) {
            const existingTag = this.state.recomendedTags.filter((tag) => tag.value === skill);
            let newTag;
            if (existingTag.length >= 1) {
                newTag = existingTag[0];
            } else {
                newTag = {
                    value: skill,
                    isCategory: false
                };
            }
            const tagAlreadyExist = this.state.tags.filter((checkingTag) => checkingTag.value === newTag.value);
            if (tagAlreadyExist.length !== 0) {
                manageErrorMessage('duplicatedTag', 'This tag has been added already');
                this.setState({
                    currentTag: '',
                });
            } else {
                if (newTag.category) {
                    this.props.handleSelectCategory(newTag);
                } else {
                    this.props.handleChangeTags([...this.state.tags, newTag]);
                }
                this.props.handleChangeTags([...this.state.tags, newTag]);
                this.setState({
                    currentTag: ''
                });
            }
        } else {
            manageErrorMessage('invalidSkill', 'The minimum length of a skill it\'s 2 characters' );
        }
    }
    
    handleKeyEvent = (event) => {
        const {key, target} = event;
        switch (key) {
        case 'Tab':
            event.preventDefault();
            event.stopPropagation();
            this.handleSubmitTag(target);
            break;
        case 'Enter':
            event.preventDefault();
            event.stopPropagation();
            this.handleSubmitTag(target);
            break;
        }
    }

    handleFocus = () => {
        this.setState({
            fieldActive: true
        });
    }

    handleBlur = () => {
        this.setState({
            fieldActive: false
        });
    }
    
    handleFordeFocusInput = () => {
        document.getElementById('userInput').focus();
    }

    render () {
        const currentSkills = this.state.tags.map((tag) => tag.value);
        return (
            <div className='skills-input' onClick={this.handleFordeFocusInput}>
                <div className='challenge-template-tags-component'>
                    <div className='active-skills'>
                        {
                            this.state.tags.map((tag, index) => (
                                <Badge key={index} className={`tagFluttr ${tag.isCategory || tag.category ? 'category-tag' : ''}`} >
                                    {tag.value}
                                    <a href='#removeTag' style={{color: 'white'}}><i id={tag.value} onClick={this.handleRemoveTag} className='fas fa-times' style={{padding: '0 0 0 10px'}}/></a>
                                </Badge>
                            ))
                        }
                    </div>
                    <form onSubmit={this.handleSubmitTag} className={this.state.fieldActive ? 'active' : ''} >
                        <i className='fal fa-plus' />
                        <input id='userInput' type='text' name='tag'
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            value={this.state.currentTag}
                            placeholder={this.props.placeholder ? this.props.placeholder : this.state.tags.length < 2 ? `You need to add at least ${2 - (this.state.tags.length)} more to continue.` : 'You can add up to 5 tags'}
                            disabled={this.state.tags.length === 5}
                            onChange={this.handleChange}
                            onKeyDown={this.handleKeyEvent}
                        />
                        { this.state.showSugestions &&
                            <ul className='skill-suggestion-list'>
                                {this.state.recomendedTags.filter((tag) => {
                                    const isPresent = currentSkills.indexOf(tag.value) === -1;
                                    return isPresent;
                                }).map((tag) => (
                                    <li data-type='skillSelection' id={tag.value} key={tag.key} onClick={() => this.handleAutoComplete(tag)} >
                                        {tag.value}
                                    </li>
                                ))}
                            </ul>
                        }
                    </form>
                </div>
            </div>
        );
    }
}

SkillsInputComponent.PropTypes = {
    handleChangeTags: PropTypes.func.isRequired,
    handleSelectCategory: PropTypes.func.isRequired,
    skills: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired
};