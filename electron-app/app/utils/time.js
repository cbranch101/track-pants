export const stringPadLeft = (string, pad, length) => {
    return (new Array(length + 1).join(pad) + string).slice(-length);
}

export const getTimeString = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secondsInMinute = seconds - (minutes * 60)
    return `${stringPadLeft(minutes, '0', 2)}:${stringPadLeft(secondsInMinute, '0', 2)}`;
}
