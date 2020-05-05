import React from 'react';
import * as texts from '../attitude/attitudeTexts';

const QuestionCard = ({ index, question: { text, choises }, radioSelected, handleRadioChange, showAlerts, language }) => {

    let score = 0;

    if (radioSelected && radioSelected.key) {
        score = radioSelected.key;
    }

    return (<div id={`question-${index}`} className='attitude-card'>
        <div className='card-question-container'>
            <div /><h6 className='card-question'>{text}</h6>{showAlerts && !radioSelected ? <i className="fas fa-exclamation" /> : <div />}
        </div>
        <div className='attitude-card-circles'>
            <p className='disagree fluttr-text-smallest'>{texts.disagreeAgree[language][0]}</p>
            <div className={`circle circle-lg circle-red ${score === 1 ? 'selected' : ''}`} name={`${index}`} pos={'1'} value={choises[0].score} onClick={handleRadioChange}></div>
            <div className={`circle circle-md circle-red ${score === 2 ? 'selected' : ''}`} name={`${index}`} pos={'2'} value={choises[1].score} onClick={handleRadioChange}></div>
            <div className={`circle circle-sm circle-grey ${score === 3 ? 'selected' : ''}`} name={`${index}`} pos={'3'} value={choises[2].score} onClick={handleRadioChange}></div>
            <div className={`circle circle-md circle-green ${score === 4 ? 'selected' : ''}`} name={`${index}`} pos={'4'} value={choises[3].score} onClick={handleRadioChange}></div>
            <div className={`circle circle-lg circle-green ${score === 5 ? 'selected' : ''}`} name={`${index}`} pos={'5'} value={choises[4].score} onClick={handleRadioChange}></div>
            <p className='agree fluttr-text-smallest'>{texts.disagreeAgree[language][1]}</p>
        </div>
    </div>);
};

export default QuestionCard;