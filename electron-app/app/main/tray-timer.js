import { POMODORO_DURATION, BREAK_DURATION } from '../actions/timer'
import { getTimeString } from '../utils/time'

let appIconShown = false

const getCurrentTimeString = (state) => {
    const {
        timer: {
            pomodoro: secondsIntoPomodoro,
            currentBreak: secondsIntoBreak,
        }
    } = state
    if (!secondsIntoPomodoro && !secondsIntoBreak) {
        return undefined
    }
    const secondsRemaining = secondsIntoPomodoro !== undefined ?
        POMODORO_DURATION - secondsIntoPomodoro :
        BREAK_DURATION - secondsIntoBreak
    return getTimeString(secondsRemaining)
}

export default (state, appIcon) => {
    const currentTimeString = getCurrentTimeString(state)
    if (currentTimeString !== undefined) {
        appIcon.setTitle(currentTimeString)
        appIconShown = true
    } else {
        if (appIconShown) appIcon.setTitle('')
        appIconShown = false
    }
}
