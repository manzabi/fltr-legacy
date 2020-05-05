const imageIcon = 'far fa-image';
const pdfFile = 'far fa-file-pdf';
const genericFile = 'far fa-file';
const documentFile = 'far fa-file-alt';
const presentatonFile = 'far fa-file-powerpoint';
const zipFile = 'far fa-file-archive';

export default {
    png: {icon: imageIcon, type: 'image'},
    jpg: {icon: imageIcon, type: 'image'},
    gif: {icon: imageIcon, type: 'image'},
    pdf: {icon: pdfFile, type: 'pdf'},
    generic: {icon: genericFile, type: 'any'},
    doc: {icon: documentFile, type: 'document'},
    docx: {icon: documentFile, type: 'document'},
    txt: {icon: documentFile, type: 'document'},
    pptx: {icon: presentatonFile, type: 'document'},
    pptm: {icon: presentatonFile, type: 'document'},
    ppt: {icon: presentatonFile, type: 'document'},
    odp: {icon: presentatonFile, type: 'document'},
    otp: {icon: presentatonFile, type: 'document'},
    odg: {icon: presentatonFile, type: 'document'},
    zip: {icon: zipFile, type: 'file'},
    rar: {icon: zipFile, type: 'file'},
    gz: {icon: zipFile, type: 'file'},
    tar: {icon: zipFile, type: 'file'},
    ['7z']: {icon: zipFile, type: 'file'}
};