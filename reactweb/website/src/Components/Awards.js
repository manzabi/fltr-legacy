import React from 'react';

const awards = [
  'all/website/images/how-it-works/awards/seedrocket-logo.png',
  // 'all/website/images/how-it-works/awards/LaVanguardia-logo-200x200px-min.png',
  'all/website/images/how-it-works/awards/vivatech2018-en_logo_200x200px-min.png',
  //'all/website/images/homepage/awards/Logo_Women4Tech-min.png',
  'all/website/images/how-it-works/awards/4yfn.png',
  // 'all/website/images/homepage/awards/Logo_startup_school-min.png',
  // 'all/website/images/homepage/awards/Logo_Iniciador-min.png',
  // 'all/website/images/homepage/awards/Logo_UPF-min.png',
  'all/website/images/homepage/awards/Logo_Dlab.png'
];

const Award = () => (
  <div className='component row vertical-align'>
    {awards.map((award, item) => (
      <img src={process.env.FluttrFilesBaseUrl+award} alt='award' key={item} className='col-xs-5 col-sm-4 col-md-3' />
    ))}
  </div>
);

export default Award;
