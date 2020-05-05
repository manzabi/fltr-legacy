const isProduction = process.env.ENV === 'production';

const hubspotCall = () => {
    if (!isProduction) {
        return;
    }
    const script = document.createElement('script');
    script.src = '//js.hs-scripts.com/4048999.js';
    script.async = true;

    document.body.appendChild(script);
};

export default hubspotCall;