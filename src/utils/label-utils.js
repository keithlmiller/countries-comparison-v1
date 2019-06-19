export const getTickLabel = (max) => {
    const labels = ['B', 'M', 'k'];
    if (max >= Math.pow(10, 10)) {
        return labels[0];
    } else if (max >= Math.pow(10, 6)) {
        return labels[1];
    } else if (max >= Math.pow(10, 3)) {
        return labels[2];
    }
    return ''
}