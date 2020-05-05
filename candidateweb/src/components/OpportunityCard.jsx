import React, { Component } from 'react';
import SkillTags from '../common/components/SkillTags';
import { isLiveOpportunity } from '../common/constants/opportunityStatus';

export default class OpportunityCard extends Component {
    state = {
        toggled: false
    };

    handleToggleDescription = () => {
        this.setState({
            toggled: !this.state.toggled
        });
    }
    render() {
        const opportunity = this.props.opportunity;

        const { logo, name } = this.props.opportunity.company;
        const {
            roleTitle,
            expire,
            tagList,
        } = this.props.opportunity;

        let expiresToShow = 'Closed';
        let isLive = isLiveOpportunity(opportunity);
        if (isLive) {
            expiresToShow = 'Expires in ' + expire.expireString;
        }
        return (
            <section className='opportunity-card'>
                <section className='company-logo'>
                    <img src={logo.url} />
                </section>
                <section className='card-contaner'>
                    <p className='opportunity-expire'>
                        <i className='fal fa-stopwatch' /> {expiresToShow}
                    </p>
                    <div>
                        <h3>
                            {`${name} · ${roleTitle}`}
                        </h3>
                    </div>

                    <SkillTags skillsList={tagList} />
                </section>
            </section>
        );


    }
}