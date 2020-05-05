import React, {Component} from 'react';
import {
    Row,
    Col,
    Grid,
    Badge,
    Button,
    Modal,
    OverlayTrigger,
    Tooltip
} from '@sketchpixy/rubix';

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
    componentWillReceiveProps (nextProps) {
        this.setState({
            questions: nextProps.questions
        });
    }
    render () {
        return (
            <Grid>
                { this.state.questions.map(q => (
                    <Row className='question-row'>
                        <Col xs={7} className='noPadding'>
                            <span className='question'>
                                {q.id}. {q.text}
                            </span>
                        </Col>
                    </Row>
                ))
                }
            </Grid>
        );
    }

}

export default NewQuestions;
