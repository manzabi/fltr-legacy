export function getRatingString (rating) {
    if (rating === 0) {
        return 'It´s time to review this candidate!';
    } else if (rating === 1) {
        return 'I would not recommend';
    } else if (rating === 2) {
        return 'I have seen better';
    } else if (rating === 3) {
        return 'This candidate is average';
    } else if (rating === 4) {
        return 'I would recommend';
    } else if (rating === 5) {
        return 'I would definitely recommend';
    }
}

export function getRatingDefault (isEdit) {
    if (isEdit) return 'Edit your rating for this candidate';
    else return 'It´s time to review this candidate!';
}
