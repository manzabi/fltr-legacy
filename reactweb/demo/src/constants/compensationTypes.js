export const COMPETITIVE = {value: 0, placeholder: 'Competitive Salary'};
export const EQUITY = {value: 1, placeholder: 'Equity only'};
export const SALARY_EQUITY = {value: 2, placeholder: 'Salary and Equity'};
export const INTERNSHIP = {value: 3, placeholder: 'Unpaid internship'};

export const getCompensationLevel = () => ([COMPETITIVE, EQUITY, SALARY_EQUITY, INTERNSHIP]);
