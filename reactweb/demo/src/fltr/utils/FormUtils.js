import React from 'react';
import { scrollTo } from '../navigation/NavigationManager';

export const IMAGE = 1;
export const REQUIRED_INPUT = 2;
export const REQUIRED_INPUT_HTML = 3;
export const REQUIRED_CHECKBOX = 4;
export const REQUIRED_EMAIL = 5;
export const REQUIRED_URL = 6;
export const CUSTOM = 99;

export function checkRichEditor(content) {
    if (content !== undefined) {
        const withImages = content.replace(/<img\s[^>]*?src\s*=\s*['\"]([^'\"]*?)['\"][^>]*?>/g, '<p>img</p>');
        const noTags = withImages.replace(/<[^>]*>/g, '');
        const noSpaces = noTags.replace(/&nbsp;/g, '');
        const clean = noSpaces.replace(/\n/g, '');
        if (clean && clean.trim()) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

export function handleValueChange(value, field, component, formValidation) {
    let formWithNewValues = { ...component.state.form, [field]: value };
    component.setState({ form: formWithNewValues }, () => checkSingleFormValue(formValidation, formWithNewValues, field, false));
}

export function handleInputChange(event, component, formValidation) {
    // console.log('handleInputChange event -> id : ' + event.target.id + " value : " + event.target.value);
    let fieldName;
    if (event.target.id.split('-')[0] === 'fluttr' && event.target.id.split('-').length > 1) fieldName = event.target.id.split('-')[1];
    else fieldName = event.target.id;
    let fleldVal = event.target.value;
    let formWithNewValues = { ...component.state.form, [fieldName]: fleldVal };
    component.setState({ form: formWithNewValues }, () => checkSingleFormValue(formValidation, formWithNewValues, fieldName, false));
}

export function isValidUrl(url) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(url);
}

export function handleCheckboxChange(event, component, formValidation) {
    // console.log('handleCheckboxChange event -> id : ' + event.target.id + " value : " + event.target.checked);
    let fieldName = event.target.id;
    let fieldVal = event.target.checked;
    let fieldCheckbox = getCheckbox(formValidation, fieldName);
    let formWithNewValues = { ...component.state.form, [fieldName]: fieldVal };
    component.setState({ form: formWithNewValues }, () => checkSingleFormValue(formValidation, formWithNewValues, fieldCheckbox, false));
}

export function handleSelectChange(event, component, formValidation) {
    // console.log('handleSelectChange event -> id : ' + event.target.id + " value : " + event.target.value);
    let fieldName = event.target.id;
    let fieldVal = event.target.value;
    let formWithNewValues = { ...component.state.form, [fieldName]: fieldVal };
    component.setState({ form: formWithNewValues }, () => checkSingleFormValue(formValidation, formWithNewValues, fieldVal, false));
}


export function handleCheckNumberChange(event, component, formValidation, specificField) {
    let fieldName = event.target.id;
    let fieldVal = event.target.value;
    // console.log('before filter : ' + fieldVal);
    let valFiltered = fieldVal.replace(/\D/g, '');
    // console.log('field: ' + fieldName + " value : " + valFiltered);
    let formWithNewValues = { ...component.state.form, [fieldName]: valFiltered };
    component.setState({ form: formWithNewValues }, () => checkSingleFormValue(formValidation, formWithNewValues, specificField, false));
}

export function getCheckbox(formValidation, field) {
    let found = null;
    Object.keys(formValidation).forEach(function (key) {
        // console.log('key : ' + key);
        let currItem = formValidation[key];
        // console.log('currItem : ' + currItem);
        // console.log('currItem.checkbox : ' + currItem.checkbox);
        if (currItem.checkbox !== undefined) {
            // console.log('included : ' + currItem.checkbox.includes(field));
            if (currItem.checkbox.includes(field)) {
                // console.log('getCheckbox -> found ' + key + " for checkbox : " + field);
                found = key;
            }
        }
    });
    // console.log("Checkbox field : " + found);
    return found;
}

export function checkForm(formValidation, form) {
    let scroll = true;
    let validForm = true;

    Object.keys(formValidation).forEach(function (key) {
        let valid = checkSingleFormValue(formValidation, form, key, scroll);
        scroll = valid && scroll;

        if (!valid) {
            validForm = false;
        }
    });

    return validForm;
}

export function checkSingleFormValue(formValidation, form, what, scroll = false) {
    // console.log('checkSingleFormValue : ' + what);
    if (what == null) {
        // console.log('ERROR checkSingleFormValue - what is null : ' + what);
        return false;
    }
    let validItem = formValidation[what];
    if (validItem != null) {
        let selector = '#' + what;
        let type = validItem.type;
        // console.log("sdfdsfdfdsffdsffffff : " + validItem.min + " " + what);
        let opt = { min: validItem.min };
        if (validItem.selector !== undefined) {
            selector = validItem.selector;
        }
        let selectorLabel = selector + 'Error';
        if (validItem.selectorLabel !== undefined) {
            selectorLabel = validItem.selectorLabel;
        }

        let value = form[what];
        if (type == REQUIRED_CHECKBOX) {
            value = [];
            let arrayLength = validItem.checkbox.length;
            for (let i = 0; i < arrayLength; i++) {
                //Do something
                let currCheckbox = validItem.checkbox[i];
                if (form[currCheckbox]) {
                    // console.log("Selected checkbox : " + currCheckbox);
                    value.push(currCheckbox);
                }
            }
        } else if (type == CUSTOM) {
            value = validItem.method();
        }

        let valid = checkValue(value, type, opt, selector, selectorLabel, scroll);
        // console.log('checkSingleFormValue - field ' + what + " valid : " + valid +" scroll if error : " + scroll + " selector : " + selector + " selectorLabel : " + selectorLabel);
        return valid;
    } else {
        // console.log('ERROR checkSingleFormValue - not found what : ' + what);
        return false;
    }

}

export function checkValue(value, type, opt, selector = '', selectorLabel = '', scroll = false) {
    // console.log('check value ' + value + " type check : " + type + " selector : " + selector + " selectorLabel : " + selectorLabel);

    if (type == IMAGE) {
        if (value == null || value == -1) {
            // console.log('ERROR check value ' + value + " type check : " + type + " selector : " + selector);
            formError(selector, selectorLabel, scroll);
            return false;
        } else {
            formOk(selector, selectorLabel);
        }
    }

    // check not empty fields
    if (type == REQUIRED_INPUT) {
        if (value !== null && typeof value === 'number') {
            formOk(selector, selectorLabel);
        } else {
            if (value == null || value == '' || value.trim() == '') {
                formError(selector, selectorLabel, scroll);
                return false;
            } else {
                // console.log("--------------options : " + JSON.stringify(opt));
                if (opt != null && opt.min != null) {
                    if (value.length < opt.min) {
                        // console.log('selector min ' + selectorLabel);
                        formError(selector, selectorLabel, scroll);
                        return false;
                    }
                }
                formOk(selector, selectorLabel);
            }
        }
    }

    // check email fields
    if (type == REQUIRED_EMAIL) {
        if (value == null || value == '' || value.trim() == '') {
            formError(selector, selectorLabel, scroll);
            return false;
        } else {
            if (validateEmail(value)) {
                formOk(selector, selectorLabel);
            } else {
                formError(selector, selectorLabel, scroll);
                return false;
            }
        }
    }

    // check url fields
    if (type == REQUIRED_URL) {
        if (value == null || value == '' || value.trim() == '') {
            formError(selector, selectorLabel, scroll);
            return false;
        } else {
            if (validateUrl(value)) {
                formOk(selector, selectorLabel);
            } else {
                formError(selector, selectorLabel, scroll);
                return false;
            }
        }
    }

    // check not empty fields html
    if (type == REQUIRED_INPUT_HTML) {
        if (value == null || value == '' || value.trim() == '' || value.trim() == '<p></p>') {
            formError(selector, selectorLabel, scroll);
            return false;
        } else {
            formOk(selector, selectorLabel);
        }
    }

    // check not empty fields html
    if (type == REQUIRED_CHECKBOX) {
        if (value == null) {
            formError(selector, selectorLabel, scroll);
            return false;
        } else {
            // check at least one selected
            if (value.length > 0) {
                formOk(selector, selectorLabel);
                return true;
            } else {
                formError(selector, selectorLabel, scroll);
                return false;
            }
        }
    }

    if (type == CUSTOM) {
        if (value) {
            formOk(selector, selectorLabel);
            return true;
        } else {
            formError(selector, selectorLabel, scroll);
            return false;
        }
    }

    return true;
}

export function formError(itemSelector, selectorLabel, scroll = false) {
    let item = $(itemSelector);
    if (item.length > 0) {
        item.addClass('form-tab-error');
        if (scroll) {
            scrollTo(item.offsetTop,0);
        }
    }

    let itemError = $(selectorLabel);
    itemError.css('display', 'block');
}

export function formOk(itemSelector, selectorLabel) {
    let item = $(itemSelector);
    if (item.length > 0) {
        item.removeClass('form-tab-error');
    }

    let itemError = $(selectorLabel);
    itemError.css('display', 'none');
}

export function validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}

export function validateUrl(str) {
    let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

    let pattern2 = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

    return pattern2.test(str);
}
