import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import ExpertReviewComponent from '../../fltr/expert/opportunity/review/ReviewComponent';

@withRouter
@connect((state) => state)
export default class ExpertReviewPage extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {

        let id;
        if(this.props.id){
            id = this.props.id;
        }else{
            id = this.props.params.id;
        }
        return (
            <ExpertReviewComponent id={id}/>
        );
    }
}