import React, { Component } from 'react';

export default class Timer extends Component {

    state = {
        elapsed: 0
    }

    componentDidMount() {
        this.timer = setInterval(this.tick, 500);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    tick = () => {
        this.setState({ elapsed: new Date() - this.props.start });
    }

    render() {
        let seconds = Math.round(this.state.elapsed / 1000);
        return <div className='timer'>
            you started {seconds} seconds ago
        </div>;
    }
}