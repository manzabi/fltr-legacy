import user from './user';
import bankInfo from './bankInfo';
import notification from './notification';
import opportunity from './opportunity';
import dashboard from './dashboard';
import judgeInvitation from './judgeInvitation';
import formActions from './form';
import uploadActions from './upload';
import expertList from './expertList';
import reviewUserList from './review';
import feed from './feed';
import trello from './trello';

module.exports = {
    ...user,
    ...bankInfo,
    ...notification,
    ...opportunity,
    ...dashboard,
    ...judgeInvitation,
    ...formActions,
    ...uploadActions,
    ...expertList,
    ...reviewUserList,
    ...feed,
    ...trello
};
