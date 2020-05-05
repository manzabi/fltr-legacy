import React, {Component} from 'react';
import Spinner from '../../common/components/Spinner';
import { handleGoDashboard } from '../../utils/navigationManager';

export default class talentLanding extends Component {
    componentDidMount () {
        if (true) {
            handleGoDashboard();
        }
    }
    render () {
        return <Spinner />;
    }
} 
