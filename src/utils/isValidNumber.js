export const isValidNumber = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    const parsedValue = Number(value);
    return Number.isInteger(parsedValue);
};
