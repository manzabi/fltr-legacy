import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { Entity } from '@sketchpixy/rubix/lib/L20n';
import ReviewUserComponent from '../../fltr/expert/opportunity/review/ReviewUserComponent';

@withRouter
@connect((state) => state)
export default class ExpertReviewUserPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title : document.title
        };
    }

    componentDidMount(){
        document.title = 'Expert View';
    }

    componentWillUnmount(){
        document.title = this.state.title;
    }

    render() {
        let edit = false;
        if (this.props.params.edit === 'edit') edit = true;
        let id;
        if(this.props.id){
            id = this.props.id;
        }else{
            id = this.props.params.id;
        }

        let userId;
        if(this.props.id){
            userId = this.props.userId;
        }else{
            userId = this.props.params.userId;
        }

        let source;
        if(this.props.source){
            source = this.props.source;
        }else{
            if (this.props.location.query.source !== undefined) {
                source = this.props.location.query.source;
            } else {
                source = 'normal';
            }
        }

        return (
            <ReviewUserComponent key={'opp_' + id + '_usr_' + userId} id={id} userId={userId} source={source} edit={edit}/>
        );
    }
}
