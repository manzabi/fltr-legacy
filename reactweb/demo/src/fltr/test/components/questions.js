import React from 'react';
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

export default ({ id, text, choises, radioSelected, handleRadioChange }) => (
    <Grid>
        <Row className='question-row'>
            <Col xs={7} className='noPadding'>
                <span className='question'>
                    {id}. {text}
                </span>
            </Col>
            <Col xs={5}>
                <Grid>
                    <Row>
                        {
                            choises.map(c =>
                                <Col xs={2} key={id + c.score}>
                                    <span className='choiseBox' name={id} onClick={handleRadioChange} value={c.score}>
                                        <OverlayTrigger placement='top' overlay={<Tooltip id='tooltip'>{c.text}</Tooltip>}>
                                            <i className={radioSelected[id] && radioSelected[id].score === c.score ? 'icon-fontello-check-1' : 'icon-fontello-check-empty'} />
                                        </OverlayTrigger>
                                    </span>
                                </Col>
                            )
                        }
                    </Row>
                </Grid>
            </Col>
        </Row>
    </Grid>
);
