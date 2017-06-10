import React, { PropTypes } from 'react'
import { propType } from 'graphql-anywhere'
import gql from 'graphql-tag'
import { POMODORO_DURATION, EARLY_COMPLETION_THRESHOLD } from '../actions/timer'
import { getCurrentTimestamp } from '../utils/time'

import TimerCard from './timer/card'

const fragments = {
    task: gql`
        fragment TimerTask on Task {
            ...TimerCardTask
        }
        ${TimerCard.fragments.task}
    `
}

class Timer extends React.Component {
    static propTypes = {
        loading: PropTypes.bool.isRequired,
        task: propType(fragments.task),
        updateTask: PropTypes.func.isRequired,
        stopBreak: PropTypes.func.isRequired,
        backToList: PropTypes.func.isRequired,
        timer: PropTypes.shape({
            pomodoro: PropTypes.number.isRequired,
            currentBreak: PropTypes.number.isRequired
        }),
        startBreak: PropTypes.func.isRequired,
        createPom: PropTypes.func.isRequired,
        startPomodoro: PropTypes.func.isRequired,
        stopPomodoro: PropTypes.func.isRequired,
        startCountingUntracked: PropTypes.func.isRequired,
        stopCountingUntracked: PropTypes.func.isRequired,
        backToSummary: PropTypes.func.isRequired
    }
    static fragments = fragments
    state = {
        step: 'waitingToStartPom'
    }
    handleStartPom = () => {
        this.props.stopCountingUntracked()
        this.props.startPomodoro().then(this.handlePomComplete).catch(e => {
            throw e
        })
        this.setState({ step: 'inPom' })
    }
    handleStopCountingUntracked = ({ count }) => {
        if (count > 30) {
            const newPom = {
                createdAt: getCurrentTimestamp(),
                interrupted: false,
                taskID: 'untracked',
                duration: count
            }
            this.props.createPom(newPom)
        }
    }
    handlePomComplete = ({ count, isCompleted, context: { taskCompleted = false } }) => {
        const newPom = {
            createdAt: getCurrentTimestamp(),
            interrupted: !isCompleted,
            taskID: this.props.task.id,
            duration: count
        }
        this.props.createPom(newPom)
        const remaining = POMODORO_DURATION - count
        const allowEarlyCompletion = remaining <= EARLY_COMPLETION_THRESHOLD
        const nextStep = isCompleted || (taskCompleted && allowEarlyCompletion)
            ? 'waitingToStartBreak'
            : 'waitingToStartPom'
        if (taskCompleted) {
            this.props.updateTask(this.props.task.id, { completed: true })
        }
        if (taskCompleted && nextStep === 'waitingToStartPom') this.props.backToList()
        this.countUntracked()
        this.setState({ step: nextStep })
    }
    countUntracked = () => {
        this.props.startCountingUntracked().then(this.handleStopCountingUntracked).catch(e => {
            throw e
        })
    }
    handleStopSession = () => {
        this.props.stopCountingUntracked()
        this.props.backToSummary()
    }
    handleStartBreak = () => {
        this.setState({ step: 'inBreak' })
        this.props.stopCountingUntracked()
        return this.props.startBreak().then(this.handleBreakComplete)
    }
    handleBreakComplete = () => {
        if (this.props.task.completed) {
            this.props.backToList()
        } else {
            this.countUntracked()
            this.setState({ step: 'waitingToStartPom' })
        }
    }
    render() {
        const { loading, task, timer } = this.props
        if (loading) return <div>Loading</div>
        return (
            <TimerCard
                timerStep={this.state.step}
                timer={timer}
                task={task}
                onStartPom={this.handleStartPom}
                onStopPom={this.props.stopPomodoro}
                onStartBreak={this.handleStartBreak}
                onStopBreak={this.props.stopBreak}
                onBackToList={this.props.backToList}
                onStopSession={this.handleStopSession}
            />
        )
    }
}

export default Timer
