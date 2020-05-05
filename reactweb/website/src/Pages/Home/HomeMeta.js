import React from 'react';
import MetaTags from 'react-meta-tags';

class HomeMeta extends React.Component {
  render () {
    return (
      <div className='wrapper'>
        <MetaTags>
          <meta name='description' content='Some description.' />
          <meta property='og:image' content='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/meta/home-share.png' />
        </MetaTags>
      </div>
    );
  }
}
export default HomeMeta;
