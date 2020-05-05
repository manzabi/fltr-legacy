import React from 'react';
import PropTypes from 'prop-types';

const SkillTags = ({ skillsList }) => (
    <section className='skill-tag-component'>
        {!!skillsList.length &&
            skillsList.map(({ category, id, value }) => {
                return (
                    <span key={id} className={`fluttr-badge ${category ? 'fluttr-badge-category' : 'fluttr-badge-skill'}`}>
                        {value}
                    </span>
                );
            })
        }
    </section>
);

SkillTags.propTypes = {
    skillsList: PropTypes.arrayOf(PropTypes.shape({
        category: PropTypes.bool.isRequired,
        id: PropTypes.number.isRequired,
        key: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    })).isRequired
};

export default SkillTags;