import React, { Component } from 'react';

import { Container, Grid, Text, Header, ProfilePic } from '@billingfluttr/crazy-ui';
import { connect } from 'react-redux';
import { fetchOpportunityAttitudeLeaderboard } from '../../redux/actions/opportunityActions';
import AsyncContainer from '../../components/asyncComponents/AsyncContainer';

@connect(({ opportunityAttitudeLeaderboard, user }) => ({ opportunityAttitudeLeaderboard, user }))
export default class TalentOpportunityAttitudeLeaderboardPage extends Component {

    componentDidMount() {
        if (this.props.match.params && this.props.match.params.opportunityId) {
            const { opportunityId } = this.props.match.params;
            this.props.dispatch(fetchOpportunityAttitudeLeaderboard(opportunityId));
        }
    }

    render() {
        const { opportunityAttitudeLeaderboard, user } = this.props;
        return (
            <AsyncContainer data={opportunityAttitudeLeaderboard}>
                <TalentOpportunityAttitudeLeaderboard
                    data={opportunityAttitudeLeaderboard.item}
                    userId={user.item.id}
                />
            </AsyncContainer>
        );
    }
}


const TalentOpportunityAttitudeLeaderboard = ({ data, userId }) => {

    const renderContent = () => {
        const totalCandidates = data.length;
        if (totalCandidates <= 10) {
            return data.map(el => renderItem(el));
        } else {
            const me = data.findIndex(({ user: { id } }) => id === userId);
            const myRank = me + 1;
            if (myRank <= 10) {
                if (totalCandidates === 11) {
                    return data.map(el => renderItem(el));
                }
                const firstTen = data.slice(0, 10);
                return [...firstTen.map(el => renderItem(el)), renderEmptyItem(), renderItem(data[data.length - 1])];
            } else if (totalCandidates - myRank > 3) {
                const firstThree = data.slice(0, 3);
                const middleFive = data.slice(me - 2, me + 3);
                return [...firstThree.map(el => renderItem(el)), renderEmptyItem(), ...middleFive.map(el => renderItem(el)), renderEmptyItem(), renderItem(data[data.length - 1])];
            } else {
                const firstThree = data.slice(0, 3);
                const lastOnes = data.slice(me - 2);
                return [...firstThree.map(el => renderItem(el)), renderEmptyItem(), ...lastOnes.map(el => renderItem(el))];
            }
        }
    };

    const renderItem = (item) => {
        if (item) {
            const { points, position, user: { id, imageUrl, imagePlaceholder, nickname } } = item;
            const itsMe = id === userId;
            return (
                <div className={`leaderboard-item${itsMe ? ' me' : ''}`} key={`leaderboard_item_${id}`}>
                    {itsMe && <div className='ribbonsito' />}
                    <Text bold style={{ width: 60, textAlign: 'center', fontSize: itsMe ? 20 : 14 }}>{position}</Text>
                    {imagePlaceholder ? renderPlaceholderPic(nickname) : <ProfilePic url={imageUrl} length='40' shape='circle' />}
                    {renderBar(points)}
                    <Text bold style={{ fontSize: 20, width: 65 }} >{points}</Text>
                </div>
            );
        }
        return null;
    };

    const renderBar = (value) => (
        <div className='bar-container'>
            <div className='bar'>
                <div className={'bar-content'} style={{ width: `calc(${value}%)` }} />
            </div>
        </div>
    );

    const renderEmptyItem = () => {
        return (
            <div className='empty-leaderboard-item' key={`empty_${Math.random()}`}>
                <div className='dot-container'>
                    {Array(3).fill('').map(e => <div className='dot' />)}
                </div>
            </div>
        );
    };

    const renderSubtitle = () => {
        const me = data.findIndex(({ user: { id } }) => id === userId);
        const myRank = me + 1;
        if (myRank > 10) {
            return (
                <Text size='xs' style={{ marginLeft: 22, marginTop: 0, marginBottom: 43 }}>
                    Your position may change until the test is closed. Keep checking the leaderboard!
                </Text>
            );
        }
        return (
            <Text bold style={{ fontSize: 15, marginLeft: 22, marginTop: 0, marginBottom: 43 }}>
                Well done! You are among the top 10
            </Text>
        );
    };

    const renderPlaceholderPic = (nickname = 'ab') => {
        const firstLetter = nickname[0].toUpperCase();
        const secondLetter = nickname[1].toUpperCase();
        const text = firstLetter + secondLetter;
        const colors = ['#5cd687', '#80cbf8', '#f36289'];
        const color = colors[Math.floor(colors.length * Math.random())];
        return (
            <div
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Text bold style={{ margin: 0, color: 'white', userSelect: 'none' }}>{text}</Text>
            </div>
        );
    };

    return (
        <Container className='attitude-leaderboard-container'>
            <Text
                bold
                className='leaderboard-title'
            >
                The bars below represent the points that have been awarded so far in this test.
            </Text>
            <Grid className='attitude-leaderboard'>
                <Header style={{ marginLeft: 22, marginBottom: 0 }}>Leaderboard</Header>
                {renderSubtitle()}
                <Grid style={{ rowGap: 0, borderBottom: '1px solid #f1f1f1' }}>
                    {renderContent()}
                </Grid>
            </Grid>
        </Container>
    );
};