import fileLibrary from "../../constants/fileLibrary";

export function getFileExtension(fileName){
    if (fileName){
        if (fileName.includes('tar.gz')){
            return 'tar.gz';
        }
        return fileName.split('.').pop();
    }
    return '';
}

export function getFileExtensionFromUrl (url) {
    const transformedDoArray = url.split('.');
    return transformedDoArray[transformedDoArray.length - 1];
} 

export function getFileType (file) {
    const extension = getFileExtensionFromUrl(file);
    return fileLibrary[extension] ? fileLibrary[extension].type : fileLibrary.generic.type;
}

export function downloadFile (url, target, name='file') {
    const link = document.createElement('a');
    link.download = name;
    link.target = target;
    link.href = url;
    link.click();
}