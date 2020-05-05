import toastr from 'toastr';

toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: 'toast-bottom-right',
    preventDuplicates: true
};

export function manageSucess (message) {
    toastr.success(message);
}

export function manageError(message) {
    toastr.error(message);
}

export function manageErrorApi (err, defaultError) {
    let message = defaultError;
    if (err && err.response.data.message) {
        message += '. ' + err.response.data.message;
    }
    toastr.error(message);
}