
export const sortByPropertyAsc = (data, property) => data.sort((a, b) => b[property] - a[property]);

export const sortByPropertyDesc = (data, property) => data.sort((a, b) => a[property] - b[property]);

export const getFirstX = (data, numberEntries) => data.slice(0, numberEntries);

export const replaceComma = (string) => string.replace(/,/g, '.');