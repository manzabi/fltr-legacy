import React from 'react';
import { connect } from 'react-redux';

// look the original component: https://github.com/srdjan/react-multistep/blob/master/src/multistep.js

@connect((state) => state)
export default class OpportunityChallengeConfigurationStepComponent extends React.Component{
    constructor(props) {
        super(props);

        this.steps = [
            {name: 'Configure Experts'},
            {name: 'Configure Test'},
            {name: 'Summary'},
        ];

    }

    getClassName(className, i){
        let selected = this.props.selected;
        let enabled = selected;
        if (this.props.enabled !== undefined){
            enabled = this.props.enabled;
        }
        // console.log('selected : ' + selected + " enabled : " + enabled);
        if (selected == i){
            return className + '-' + 'doing';
        } else if (selected > i){
            if (enabled > i){
                return className + '-' + 'done';
            } else {
                return className + '-' + 'waiting';
            }

        } else {
            return className + '-' + 'todo';
        }
    }

    handleOnClick(evt) {
        // console.log('click : ' + evt.currentTarget.value);
    }

    renderSteps() {
        return this.steps.map((s, i)=> (
            <li onClick={this.handleOnClick} className={this.getClassName('progtrckr', i)} key={i} value={i}>
                <em>{i+1}</em>
                <span>{this.steps[i].name}</span>
            </li>
        ));
    }

    render(){
        return(
            <div className="opportunityChallengeConfigurationStepComponent">
                <ol className="progtrckr">
                    {this.renderSteps()}
                </ol>
            </div>
        );
    }


}
