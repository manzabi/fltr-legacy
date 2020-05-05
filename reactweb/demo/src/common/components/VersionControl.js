import React, {Component} from 'react';
import axios from 'axios';
import FullScreenComponent from '../../fltr/template/FullscreenComponent';
import CrazyButton from '../../layout/buttons/CrazyButtons';

export default class VersionControl extends Component {
    constructor(props) {
        super(props);
        const isDevelopment = process.env.ENV === 'development';
        const state = {
            onLoad: false,
            hotUpdate: false,
            disabled: true
        };
        if (!isDevelopment) {
            axios.get('/version.json')
                .then(({data}) => {
                    // eslint-disable-next-line no-console
                    console.table({...data, envVersion: process.env.VERSION});
                    window.ENV_DATA = {...data, envVersion: process.env.VERSION};
                    if (data.version !== process.env.VERSION) {
                        state.onLoad = true;
                    }
                });
        } else {
            this.setDevelopmentEnhancers();
        }
        this.state = state;
    }

    componentDidMount() {
        const isDevelopment = process.env.ENV === 'development';
        if (!isDevelopment) {
            this.handleCheckUpdate();
        }
    }

    componentWillUnmount() {
        if (this.updateDaemon) {
            clearTimeout(this.updateDaemon);
        }
    }

    handleCheckUpdate = () => {
        if (this.updateDaemon) {
            clearTimeout(this.updateDaemon);
        }
        this.updateDaemon = setTimeout(() => this.timeoutCallback, 10000);
    };

    timeoutCallback = () => {
        // eslint-disable-next-line no-console
        console.log('---------------------------------------------');
        axios.get('/version.json')
            .then(({data}) => {
                // eslint-disable-next-line no-console
                console.table({...data, envVersion: process.env.VERSION});
                window.ENV_DATA = {...data, envVersion: process.env.VERSION};
                if (data.version !== process.env.VERSION) {
                    this.setState({hotUpdate: true});
                }
                this.handleCheckUpdate();
            });
    };


    manageUpdate = () => {
        window.location.reload(true);
    };

    setDevelopmentEnhancers = () => {
        window.setHotUpdate = () => {this.setState({hotUpdate: !this.state.hotUpdate});};
        window.setLoadUpdate = () => {this.setState({onLoad: !this.state.onLoad});};
    };
    render() {
        const {onLoad, hotUpdate} = this.state;
        if (this.state.disabled) {
            return this.props.children;
        } else if (onLoad) {
            return (
                <FullScreenComponent>
                    <h1>Please update</h1>
                    <CrazyButton text='Update' action={this.manageUpdate} />
                </FullScreenComponent>
            );
        } else {
            return (
                <div className='update-notifier'>
                    {hotUpdate &&
                        <div
                            style={{
                                width: '100%',
                                position: 'fixed',
                                bottom: 0,
                                left: 0,
                                zIndex: 6,
                                display: 'flex',
                                justifyContent: 'space-around',
                                backgroundColor: '#fafafa'
                            }}
                            className='update-notification-content'>
                            <h1>Please update</h1>
                            <CrazyButton text='Update' action={this.manageUpdate} />
                        </div>
                    }
                    {this.props.children}
                </div>
            );
        }
    }
}