import React from 'react';
import { openFullScreenFix, closeFullScreenFix } from '../../common/uiUtils';

import PropTypes from 'prop-types';
import {Portal} from 'react-portal';
import Container from '../../layout/layout/Container';
import Grid from '../../layout/layout/Grid';

export default class FullScreen extends React.Component {

    state = {
        open: false
    };

    close = () => {
        if (this.props.onClose) {
            this.props.onClose();
        } else {
            this.setState({
                open: false
            });
        }
        if (this.props.manageUiFix) {
            closeFullScreenFix();
        }
    };

    open = () => {
        this.setState({
            open: true
        });
        if (this.props.manageUiFix) {
            openFullScreenFix();
        }
    };

    componentDidMount () {
        if (this.props.open) this.open();
    }

    componentWillReceiveProps (props) {
        if (!this.state.open && props.open) {
            this.open();
        }
        /*else if (!this.state.open && !props.open) {
            this.close();
        }*/ else if (!props.open && this.state.open) {
            this.setState({open: false});
            closeFullScreenFix();
        }
    }

    render(){
        let style = {
            display: 'none'
        };
        if (this.state.open){
            style = {
                display: 'block'
            };
            return (
                <Portal>
                    <Container fluid style={{margin: 0, padding: 0, width: '100%'}}>
                        <Grid className={`overlay ${this.props.className}`} style={style}>
                            <div>{this.props.children}</div>
                        </Grid>
                    </Container>
                </Portal>
            )
        }

        return null;
    }
    static propTypes = {
        manageUiFix: PropTypes.bool.isRequired,
        open: PropTypes.bool.isRequired
    };
    static defaultProps = {
        manageUiFix: true
    };
}


