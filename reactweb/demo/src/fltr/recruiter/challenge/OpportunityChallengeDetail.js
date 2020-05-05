import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import OpportunityChallengeShow from '../../opportunity/challenge/OpportunityChallengeShow';

@withRouter
@connect((state) => state)
export default class OpportunityChallengeDetail extends React.Component {

    constructor(props) {
        super(props);

    }

    getId(){
        let id;
        if(this.props.id){
            id = this.props.id;
        }else{
            id = this.props.params.id;
        }
        return id;
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

    render(){

        let id = this.getId();
        let back = this.getBack();

        return (
            <OpportunityChallengeShow id={id} back={back}/>
        );

    }

}