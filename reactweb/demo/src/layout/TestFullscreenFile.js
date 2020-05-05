import React, {Component} from 'react';
import FullscreenFile from './layout/FullscreenFile';

export default class TestFullscreenFile extends Component {
    state = {
        open: false   
    }

    handleToggle = () => {
        this.setState({
            open: true
        });
    }

    render () {
        return (
            <div>
                <h1>
                    Hola que ase
                </h1>
                <button onClick={this.handleToggle}>Toggle</button>
                <FullscreenFile
                    open={this.state.open}
                    file='http://qa.fluttr.in/file/cv/usr_4337_63342653-7748-4baa-8c3d-aa78d6189905.pdf'
                />
            </div>
        );
    }
}