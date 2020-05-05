const isProduction = process.env.ENV === 'production';

const hubSpot = () => {
  if (!isProduction) {
    return;
  }
  const scriptTag = document.createElement('script');
  scriptTag.src = '//js.hs-scripts.com/4048999.js';
  scriptTag.async = true;

  document.body.appendChild(scriptTag);
};

export default hubSpot;