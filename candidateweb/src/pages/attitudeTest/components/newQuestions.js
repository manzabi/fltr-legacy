import React, {Component} from 'react';

/**
 * <span className='choiseText'>
 {c.text}
 </span>

 */

class NewQuestions extends Component {
    constructor (props) {
        super(props);
        this.state = ({
            ...props
        });
    }
    // componentWillReceiveProps (nextProps) {
    //     this.setState({
    //         questions: nextProps.questions
    //     });
    // }
    render () {
        return (
            <div className='choise-container'>
                { this.state.questions.map(q => (
                    <div className='question-row'>
                        <div className='noPadding'>
                            <span className='question'>
                                {q.id}. {q.text}
                            </span>
                        </div>
                        <div className='choise-container'>
                            {/* {
                                q.choises.map(c =>
                                    <div key={q.id + c.score}>
                                        <span className='choiseBox' name={q.id} onClick={q.handleRadioChange} value={c.score}>
                                            <OverlayTrigger placement='top' overlay={<Tooltip id='tooltip'>{c.text}</Tooltip>}>
                                            <i className={q.radioSelected[id] && q.radioSelected[id].score === c.score ? 'fal fa-check-square' : 'fal fa-square'} />
                                            </OverlayTrigger>
                                        </span>
                                    </div>
                                )
                            } */}
                            hola que ase
                        </div>
                    </div>
                ))
                }
            </div>
        //     <div className='question-row'>
            //     <div className='noPadding'>
            //         <span className='choiseBox'>
            //             {id}. {text}
            //         </span>
            //     </div>
        // </div>
        );
        
    }

}

export default NewQuestions;
