import React from 'react';
import ProfilePic from '../../layout/uiUtils/ProfilePic';
import { Text } from '../../layout/FluttrFonts';

const PlayerUserInfo = ({ candidate: { image, name, role, nickname } }) => (
    <section className='candidate-detail'>
        <ProfilePic url={image} length='30' shape='circle' />
        <div className='candidate-detail-content'>
            <Text size='xs' style={{ marginBottom: 0 }}>
                {name}
            </Text>
            <Text size='xs' style={{ color: '#adb4c3', marginBottom: 0 }}>
                {nickname}
            </Text>
        </div>

    </section>
);

export default PlayerUserInfo;