import React, {Component} from 'react';
import {connect} from 'react-redux';

import ExpertEditProfileComponent from '../../../fltr/expert/profile/ExpertEditProfileComponent';

@connect((state) => state)
export default class ExpertProfileEditPage extends Component {
    constructor () {
        super();
    }

    getBack(){
        let back;
        if(this.props.back){
            back = this.props.back;
        }else if (this.props.route){
            back = this.props.route.back;
        }
        return back;
    }

    render() {
        const back = this.getBack();

        return (
            <div className="containerSection expertProfileEditPage">
                <ExpertEditProfileComponent back={back}/>
            </div>
        );
    }
}

