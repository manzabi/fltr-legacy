import React, { Component } from 'react';

export default class RecruiterOpportunityCloseModalCandidate extends Component {


    render() {
        const { candidateName, candidatePicture, selected, manageSelect, index, filtered } = this.props;

        if (!filtered) {
            return (<div className='close-modal-candidate-card' index={`candidate-${index}`} onClick={() => manageSelect(index)}>
                {selected ? <i className="fas fa-check" /> : <div className='filler'></div>}
                <img className={selected ? 'selected' : ''} src={candidatePicture} />
                <p>{candidateName}</p>
            </div>);
        } else  if (filtered.completeName === candidateName) {
            return (<div className='close-modal-candidate-card' index={`candidate-${index}`} onClick={() => manageSelect(index)}>
                {selected ? <i className="fas fa-check" /> : <div className='filler'></div>}
                <img className={selected ? 'selected' : ''} src={candidatePicture} />
                <p>{candidateName}</p>
            </div>);
        } else {
            return (<div></div>);
        }

    }
}