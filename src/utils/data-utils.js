
export const sortByPropertyAsc = (data, property) => data.sort((a, b) => b[property].value - a[property].value);

export const sortByPropertyDesc = (data, property) => data.sort((a, b) => a[property].value - b[property].value);

export const getFirstX = (data, numberEntries) => data.slice(0, numberEntries);

export const replaceComma = (string) => string.replace(/,/g, '.');

export const getPropertyAvg = (data, property) => Math.round(data.reduce((a, b) => a + b[property].value, 0) / data.length);
