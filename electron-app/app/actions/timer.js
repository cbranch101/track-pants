import { START_TIMER, ADVANCE_TIMER, STOP_TIMER } from '../reducers/timer'

export const POMODORO_DURATION = 1500
export const EARLY_COMPLETION_THRESHOLD = 300
export const BREAK_DURATION = 300

export const startTimer = (name, value) => ({
    type: START_TIMER,
    payload: { name, value }
})

export const tick = (name, value) => ({
    type: ADVANCE_TIMER,
    payload: { name, value }
})

export const stopTimer = name => ({
    type: STOP_TIMER,
    payload: { name }
})

const getDeferred = () => {
    const deferred = {}
    const promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve
        deferred.reject = reject
    })
    return {
        ...deferred,
        promise
    }
}

const getTimerHandler = () => {
    const timers = {}
    const stop = (timerName, isCompleted = false, context = {}) => {
        const currentTimer = timers[timerName]
        if (currentTimer) {
            const { handler, deferred, count } = currentTimer
            clearInterval(handler)
            deferred.resolve({ count, isCompleted, context })
            delete timers[timerName]
        }
        return stopTimer(timerName)
    }
    const getTick = (timerName, stopFunc, dispatch) => () => {
        const timer = timers[timerName]
        const { count } = timer

        const newCount = count + 1
        timers[timerName].count = newCount
        dispatch(tick(timerName, newCount))
        if (stopFunc && stopFunc(newCount)) {
            dispatch(stop(timerName, true))
        }
    }
    const start = (timerName, stopFunc) => dispatch => {
        const timer = setInterval(getTick(timerName, stopFunc, dispatch), 1000)
        const deferred = getDeferred()
        timers[timerName] = {
            deferred,
            handler: timer,
            count: 0
        }
        dispatch(startTimer(timerName, 0))
        return deferred.promise
    }
    return {
        startFor: (timerName, duration) => start(timerName, count => count === duration),
        start,
        stop
    }
}

const { startFor, start, stop } = getTimerHandler()

export const startCountingUntracked = () => start('untracked')
export const stopCountingUntracked = () => stop('untracked')

export const stopPomodoro = taskCompleted => stop('pomodoro', false, { taskCompleted })

export const startPomodoro = () => startFor('pomodoro', POMODORO_DURATION)

export const stopBreak = () => stop('currentBreak')

export const startBreak = () => startFor('currentBreak', BREAK_DURATION)

export { startFor, start, stop }
