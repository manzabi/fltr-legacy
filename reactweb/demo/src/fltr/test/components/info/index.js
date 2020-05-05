import React from 'react';
import Tests from './tests';
import TestInfo from './test-info';

export default ({ gender, age, country, handleChange, buttonSubmitDisabled, buttonSubmit, hideMain, loading, switchTest, selectedTest }) => (
    <div style={{ display: hideMain && !loading ? 'block' : 'none' }}>
        <TestInfo />
        <Tests switchTest={switchTest} selectedTest={selectedTest} />
        <span>
            <p style={{marginTop: '50px'}}>
                <button className='navButton' onClick={buttonSubmit} disabled={buttonSubmitDisabled}>
                    <i className='material-icons' style={{ fontSize: '40px' }}>navigate_next</i>
                </button>
            </p>
        </span>
    </div>
);
