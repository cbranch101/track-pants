import moment from 'moment'

export const stringPadLeft = (string, pad, length) => {
    return (new Array(length + 1).join(pad) + string).slice(-length)
}

export const getTimeString = seconds => {
    const minutes = Math.floor(seconds / 60)
    const baseSeconds = minutes * 60
    const secondsInMinute = seconds - baseSeconds
    return `${stringPadLeft(minutes, '0', 2)}:${stringPadLeft(secondsInMinute, '0', 2)}`
}

const timeStampToMoment = (timestamp) => moment(timestamp * 1000)
export const dateStringToMoment = (dateString) => moment(dateString, 'YYYY-MM-DD')

export const timeStampToDateString = (timestamp) => timeStampToMoment(timestamp).format('YYYY-MM-DD')

export const formatAsClockTime = time => timeStampToMoment(time).format('h:mm')

export const isOnDay = (timestamp, dateString) => dateStringToMoment(dateString)
    .isSame(timeStampToMoment(timestamp), 'day')

export const isBeforeDay = (timestamp, dateString) => dateStringToMoment(dateString)
    .isAfter(timeStampToMoment(timestamp), 'day')

export const isAfterDay = (timestamp, dateString) => dateStringToMoment(dateString)
    .isBefore(timeStampToMoment(timestamp), 'day')

export const getCurrentTimestamp = () => Date.now() / 1000
