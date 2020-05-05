import React, {Component} from 'react';

/**
 * <span className='choiseText'>
 {c.text}
 </span>

 */

export default class Questions extends Component {
    render () {
        const { id, text, choises, radioSelected, handleRadioChange } = this.props;
        return (
            <div className='question-row'>
                <div className='noPadding'>
                    <span className='question'>
                        {id}. {text}
                    </span>
                </div>
                <div className='choise-container'>
                    {
                        choises.map(c =>
                            <div className='choise-box-container' data-hint={c.text} key={id + c.score}>
                                <span className='choiseBox' name={id} onClick={handleRadioChange} value={c.score}>
                                    {/* <OverlayTrigger placement='top' overlay={<Tooltip id='tooltip'>{c.text}</Tooltip>}> */}
                                    <i className={radioSelected[id] && radioSelected[id].score === c.score ? 'fal fa-check-square' : 'fal fa-square'} />
                                    {/* </OverlayTrigger> */}
                                </span>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
}
