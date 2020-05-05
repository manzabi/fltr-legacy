import React from 'react';

import * as pendingTypes from '../../../constants/opportunityJudgePendingType';
import ExpertPendingInvitationDetailItem from './ExpertPendingInvitationDetailItem';
import EmptyBanner from '../../template/EmptyBanner';

export default class ExpertPendingInvitationsComponent extends React.Component {
    onUpdateList(){
        if (this.props.onRefresh !== undefined){
            this.props.onRefresh();
        }
    }

    render(){
        let data = this.props.data;

        let items = [];
        for(let i = 0; i < Object.keys(data.item).length; i++){
            let goodItem = false;
            switch(data.item[i].type){
            case pendingTypes.EXPERT:
                goodItem = true;
                break;
            case pendingTypes.CHALLENGE:
                goodItem = true;
                break;
            default:
                goodItem = false;
            }

            if (goodItem) {
                items.push(
                    <ExpertPendingInvitationDetailItem key={data.item[i].opportunity.id} data={data.item[i]} onUpdateOpportunities={() => this.onUpdateList()}/>
                );
            }
        }

        if (items.length == 0) {
            items.push(<EmptyBanner key="empty" text="No Pending Invitations" />);
        }

        return (
            <div>
                {items}
            </div>
        );
    }
}