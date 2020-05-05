import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
    Badge
} from '@sketchpixy/rubix';
import Spinner from '../../Spinner';

const defaltPageSize = 15;


@connect((state) => state)
export default class RecruiterOpportunityTagAutosugest extends Component {
    constructor () {
        super();
        this.state = {
            showOther: false,
            page: 0,
            pageNumber: 0,
        };
    }

    componentWillReceiveProps (newProps) {
        if (newProps.selectedCategory && this.state.showOther) {
            this.setState({
                showOther: false,
                page: 0
            });
        }
    }

    handleSelectCategory = (skill) => {
        this.props.handleSelectCategory(skill);
        this.setState({
            page: 0
        });
    }

    renderEmptySkills = () => {
        return (
            [
                <p key='skillsEmpty' className='fluttr-text-md' style={{width: '100%'}}>There are no skills related to this category, please, choose one of this skills or add you own skills.</p>,
                ...this.renderOthers()
            ]
        );
    }

    renderOthers = () => {
        let skills = Object.keys(this.props.skillsList).map((key) => {
            if(this.props.skillsList[key] && key !== 'content') {
                return this.props.skillsList[key];
            }
        });
        skills.pop();
        const activeSkills = this.props.activeSkills.map((skill) => skill.value);
        skills = skills.filter((skill) => !activeSkills.includes(skill.value));
        if (this.state.pageNumber !== Math.round(skills.length / defaltPageSize)) {
            this.setState({
                pageNumber: Math.round(skills.length / defaltPageSize),
                showPagination: true
            });
        }
        return (
            // <h1>Other skills</h1>  
            skills.slice(this.state.page * defaltPageSize, (this.state.page + 1) * defaltPageSize).map((currentSkill) => {
                if (currentSkill && currentSkill.value) {
                    return (
                        <Badge
                            style={{marginRight: '5px', cursor: 'pointer'}}
                            onClick={() => this.handleSelectSkill(currentSkill)}
                            className='tagFluttr'
                            key={currentSkill.value}
                        >
                            {currentSkill.value}
                        </Badge>
                    );
                }
            })
        );
    }

    handleSelectSkill = (skill) => {
        if (skill.category) {
            this.setState({
                showOther: false,
                showPagination: false
            });
            this.props.handleSelectCategory(skill);
        } else {
            this.props.handleAddSkill(skill);
        }
    }

    renderSugestions = () => {
        const objectStored = this.props.opportunitySkillsByCategory;
        const {selectedCategory} = this.props;
        if (this.props.loadingCategory) {
            return (
                <Spinner />
            );
        } else if (this.state.showOther && this.props.skillsList) {
            return this.renderOthers();
        } else if (objectStored.item && !selectedCategory) {
            if (this.state.showPagination) {
                this.setState({
                    showOther: false,
                    showPagination: false,
                    page: 0,
                    pageNumber: 0
                });
            }
            return (
                [
                    ...objectStored.item.map((skill) =>
                        <Badge
                            key={skill.id}
                            style={{marginRight: '5px', cursor: 'pointer'}}
                            onClick={() => this.handleSelectCategory(skill)}
                            className='tagFluttr category-tag'
                        >
                            {skill.value}
                        </Badge>
                    ),
                    <Badge
                        key='others'
                        style={{marginRight: '5px', cursor: 'pointer'}}
                        onClick={this.handleShowOthers}
                        className='tagFluttr category-tag'
                    >
                    others
                    </Badge>
                ]
            );

        } else if (selectedCategory && selectedCategory.skills) {
            const activeSkills = this.props.activeSkills.map((skill) => skill.value);
            const filteredSkills = selectedCategory.skills.content.filter((skill) => !activeSkills.includes(skill.value));
            if (this.state.pageNumber !== (Math.round(filteredSkills.length / defaltPageSize)) && filteredSkills.length) {
                this.setState({
                    pageNumber: Math.round(filteredSkills.length / defaltPageSize),
                    showPagination: true
                });
            }
            if (filteredSkills.length) {
                return (
                    filteredSkills.slice(this.state.page * defaltPageSize, (this.state.page + 1) * defaltPageSize).map((skill) => (
                        <Badge
                            key={skill.id}
                            style={{marginRight: '5px', cursor: 'pointer'}}
                            onClick={() => this.handleSelectSkill(skill)}
                            className="tagFluttr"
                        >
                            {skill.value}
                        </Badge>
                    ))
                );
            } else {
                return this.renderEmptySkills();
            }
        }
    }

    handleShowOthers = () => {
        this.setState({
            showOther: true,
            showPagination: true,
            page: 0
        });
    }

    backToCategories = () => {
        this.setState({
            showOther: false,
            showPagination: false,
            page: 0,
            pageNumber: 0
        });
    }

    handleSelectPage = (choise) => {
        console.log(choise);
        switch (choise) {
        case 'prev':
            if (this.state.page > 0) {
                this.setState({
                    page: this.state.page -1
                });
            }
            break;
        case 'next':
            if (this.state.page < this.state.pageNumber - 1) {
                this.setState({
                    page: this.state.page +1
                });
            }
            break;
        }
    }

    render () {
        return (
            <section className='fluttr-skills-autosugest'>
                <section className='sugestion-section'>
                    {this.renderSugestions()}
                </section>
                <section className='actions-section'>
                    { this.state.showPagination &&
                        [
                            <div key='paginationGrow' className='skills-pagination-fix'/>,
                            <div key='paginationComponent' className='skills-pagination'>
                                { this.state.page !== 0 && <i className='fal fa-angle-double-left' onClick={() => this.handleSelectPage('prev')}/> || <div />}
                                <span className='current-page'>{this.state.page + 1}/{this.state.pageNumber}</span>
                                { this.state.page < this.state.pageNumber - 1 && <i className='fal fa-angle-double-right' onClick={() => this.handleSelectPage('next')}/> || <div />}
                            </div>
                        ]
                    }
                    { this.state.showOther &&
                        <span onClick={this.backToCategories} className='fluttr-text-small' style={{cursor: 'pointer'}}>
                            <i className='fal fa-angle-double-left' />
                        &nbsp;Go back to categories
                        </span>
                    }
                </section>
            </section>

        );
    }
}