import { DMYHm } from '../constants/timeFormats'; 

export function getExpireTime(data, role = 'normal') {
    let expire = getExpire(data, role);
    let t = getTimeRemaining(expire.expireDate);
    let isExpire = expire.isExpireDate;

    if (!isExpire) {
        // closed
        return '';
    }

    let days = (t.days);
    let hours = ('0' + t.hours).slice(-2);
    let minutes = ('0' + t.minutes).slice(-2);
    let seconds = ('0' + t.seconds).slice(-2);

    return getPrimaryString(days, hours, minutes);
}

export function getPrimaryString(days, hours, minutes) {
    if (days >= 1) {
        return days + ' days';
    } else {
        return hours + 'h:' + minutes + 'm';
    }
}

export function getExpire(data, role) {
    // console.log('role : ' + role);
    switch (role) {
        case 'normal':
            return data.expire;
        case 'expert':
            return data.expire;
        case 'player':
            return data.expire;
        default:
            return data.expire;
    }
}

export function getTimeRemaining(endtime) {

    var safeDate = null;

    if (endtime == null) {
        return null;
    }

    if (endtime != null) {
        var datestr = endtime.split(/[-T.]/);
        safeDate = new Date(datestr.slice(0, 3).join('/') + ' ' + datestr[3]);
    }

    safeDate.setTime(safeDate.getTime() - safeDate.getTimezoneOffset() * 60 * 1000);

    var t = Date.parse(safeDate) - Date.parse(new Date());

    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    var days = Math.floor(t / (1000 * 60 * 60 * 24));

    return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
}

export function getSafeDate(date) {

    if (date === null) {
        return null;
    }

    let datestr = date.split(/[-T.]/);
    let safeDate = new Date(datestr.slice(0, 3).join('/') + ' ' + datestr[3]);
    safeDate.setTime(safeDate.getTime() - safeDate.getTimezoneOffset() * 60 * 1000);

    return moment(safeDate);
}

export function getTimeString(time, format = DMYHm) {
    if (time != null) {
        return getSafeDate(time).format(format);
    }
    return '';
}

export function getTimeStringFrom(time) {
    if (time) {
        return getSafeDate(time).fromNow();
    }
    return '';
}

export function getTimeStringExtended(time) {
    return getTimeFormatted(time, 'Do MMMM YYYY HH:mm');
}

export function getTimeFormatted(time, format) {
    if (time != null) {
        let datestr = time.split(/[-T.]/);
        let safeDate = new Date(datestr.slice(0, 3).join('/') + ' ' + datestr[3]);
        safeDate.setTime(safeDate.getTime() - safeDate.getTimezoneOffset() * 60 * 1000);
        return moment(safeDate).format(format);
    }
    return '';
}

export function getDateString(time, format) {
    return moment(time).format(format);
}