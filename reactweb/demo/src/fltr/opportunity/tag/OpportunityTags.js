import React from 'react';

const OpportunityTags = ({ numberOfTags = 15, taglist = [], showIcon = true }) => {
    function renderTags(numberOfTags) {
        let tagList = [];
        let count = 0;
        taglist.map(({ key, value }) => {
            if (count < numberOfTags) {
                tagList.push(
                    <span key={key} className='crazy-badge' >
                        {value}
                    </span>
                );
                count++;
            }
        });

        return (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {showIcon &&
                    <i className='icon-entypo-lab-flask icon-right-padding fluttrBlue' />
                }
                {!taglist.length &&
                    <span className='fluttrBlue'>No skills defined</span>
                }
                {tagList}
            </div>
        );
    }
    return (
        <div>
            {renderTags(numberOfTags)}
        </div>
    );
};

export default OpportunityTags;