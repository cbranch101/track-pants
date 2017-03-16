import { START_TIMER, ADVANCE_TIMER, STOP_TIMER } from '../reducers/timer'

export const startTimer = (name) => ({
    type: START_TIMER,
    payload: { name }
})

export const tick = (name, value) => ({
    type: ADVANCE_TIMER,
    payload: { name, value },
})

export const stopTimer = (name) => ({
    type: STOP_TIMER,
    payload: { name },
})

const getTimerHandler = () => {
    const timers = {}
    const stop = (timerName) => {
        clearInterval(timers[timerName].handler)
        delete timers[timerName]
    }
    const getTick = (timerName, stopFunc, dispatch) => () => {
        const timer = timers[timerName]
        const {
            count,
        } = timer

        const newCount = count + 1
        timers[timerName].count = newCount
        dispatch(tick(timerName, newCount))
        if (stopFunc && stopFunc(newCount)) {
            stop(timerName)
            dispatch(stopTimer(timerName))
        }
    }
    const start = (timerName, stopFunc) => (dispatch) => {
        const timer = setInterval(getTick(timerName, stopFunc, dispatch), 1000)
        timers[timerName] = {
            handler: timer,
            count: 0,
        }
        dispatch(startTimer(timerName, 0))
    }
    return {
        startFor: (timerName, duration) => start(timerName, count => count === duration),
        start,
        stop,
    }
}

const {
    startFor,
    start,
    stop,
} = getTimerHandler()

export const startPomodoro = () => startFor('pomodoro', 30)

export {
    startFor,
    start,
    stop,
}
