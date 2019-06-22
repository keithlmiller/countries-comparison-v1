export const getTicks = (max) => {
    const labels = ['B', 'M', 'k'];
    if (max >= Math.pow(10, 10)) {
        return {
            label: labels[0],
            format: Math.pow(10, 9),
        };
    } else if (max >= Math.pow(10, 6)) {
        return {
            label: labels[1],
            format: Math.pow(10, 6),
        };
    } else if (max >= Math.pow(10, 3)) {
        return {
            label: labels[2],
            format: Math.pow(10, 3),
        };
    }
    return {
        label: '',
        format: 1,
    }
}

