const Config = require('Config');
const isProduction = process.env.ENV === 'production';
// console.log(isProduction, process.env.ENV)

const inspectlet = () => {
    if (!isProduction) {
        return;
    }
    window.__insp = window.__insp || [];
    __insp.push(['wid', 360495233]);
    (function () {
        function ldinsp () { if (typeof window.__inspld !== 'undefined') return; window.__inspld = 1; var insp = document.createElement('script'); insp.type = 'text/javascript'; insp.async = true; insp.id = 'inspsync'; insp.src = (document.location.protocol == 'https:' ? 'https' : 'http') + '://cdn.inspectlet.com/inspectlet.js'; var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(insp, x); }
        setTimeout(ldinsp, 500); document.readyState != 'complete' ? (window.attachEvent ? window.attachEvent('onload', ldinsp) : window.addEventListener('load', ldinsp, false)) : ldinsp();
    })();
};

export default inspectlet;
