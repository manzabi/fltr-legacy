import React from 'react';

import { connect } from 'react-redux';

import {
    Row,
    Col,
    Grid,
    Button,
    OverlayTrigger,
    Tooltip,
    Image
} from '@sketchpixy/rubix';

import AsynchContainer from '../../../template/AsynchContainer';

import {fetchLeaderBoard} from '../../../../redux/actions/reviewActions';

import { Entity } from '@sketchpixy/rubix/lib/L20n';

@connect((state) => state)
export default class LeaderboardComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let id = this.props.id;

        this.props.dispatch(fetchLeaderBoard(id));
    }

    render() {

        let id = this.props.id;
        let objectStored = this.props.reviewLeaderboard;

        return (
            <AsynchContainer data={objectStored} manageError={false}>
                <LeaderboardContent id={id} data={objectStored} />
            </AsynchContainer>
        );
    }

}

class LeaderboardContent extends React.Component{

    constructor(props) {
        super(props);
    }

    render(){

        let id = this.props.id;
        let item = this.props.data;

        if (item.isError){
            return(
                <div style={{marginTop:50,textAlign:'center'}}>
                    <span className="summaryTitle">
                        Leaderboard not available
                    </span>
                </div>
            );

        }

        let userList = item.item;

        let leaderBoardList = userList.map(function(content){
            return (
                <LeaderBoardItem key={content.id} data={content} />
            );
        });

        return (
            <Grid className="leaderboardComponent">
                <Col xs={12} className="noPadding">
                    <span className="summaryTitle">
                        {leaderBoardList.length} Applicants participating
                    </span>
                    <br/><br/>
                    {leaderBoardList}
                </Col>
            </Grid>
        );
    }
}

class LeaderBoardItem extends React.Component{
    componentDidMount(){

    }

    render(){
        let data = this.props.data;
        // console.log('leaderboard item : ' + JSON.stringify(data));
        let id = data.id;
        let name = data.name;

        let classNameColor = 'progress-bar-orange';
        if (data.passReview){
            classNameColor = 'progress-bar-green';
        }

        return (
            <div id={id}>
                <div className="progress-position">
                    <span>{data.positionStr}</span>
                </div>
                <div className="progress">
                    <div className={'progress-bar ' + classNameColor} role="progressbar" aria-valuenow={data.percentage} aria-valuemin="0" aria-valuemax="100"
                        style={{width: data.percentage + '%'}}>
                    </div>
                    <div style={{width: data.percentagePass + '%', height: '100%', position: 'absolute', top: 0, left: 0, borderRight: '1px dashed #333'}}>
                    </div>
                    <span className="progress-type">
                        {name}
                    </span>
                    <span className="progress-completed">{data.points} pt.</span>
                </div>
            </div>
        );
    }
}
