import React, { PropTypes } from 'react'
import { propType } from 'graphql-anywhere'
import gql from 'graphql-tag'
import RaisedButton from 'material-ui/RaisedButton'
import { green400, purple400, red400 } from 'material-ui/styles/colors'
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card'

import { POMODORO_DURATION, BREAK_DURATION } from '../../actions/timer'
import { getTimeString } from '../../utils/time'

const Buttons = ({ timerStep, onStartPom, onStopPom, onStartBreak, onStopBreak, onBackToList }) => {
    const buttons = []
    if (timerStep === 'waitingToStartPom') {
        buttons.push([
            <RaisedButton onClick={onBackToList} backgroundColor={purple400} label="Back to List" />,
            <RaisedButton onClick={onStartPom} backgroundColor={green400} label="Start Working" />
        ])
    }
    if (timerStep === 'inPom') {
        buttons.push([
            <RaisedButton onClick={() => onStopPom(true)} backgroundColor={green400} label="Complete Early" />,
            <RaisedButton onClick={() => onStopPom(false)} backgroundColor={red400} label="Interrupt" />,
        ])
    }
    if (timerStep === 'waitingToStartBreak') {
        buttons.push([
            <RaisedButton onClick={onStartBreak} backgroundColor={green400} label="Start Break" />,
        ])
    }
    if (timerStep === 'inBreak') {
        buttons.push([
            <RaisedButton onClick={onStopBreak} backgroundColor={red400} label="Cancel Break" />,
        ])
    }

    return (<CardActions>
        {buttons}
    </CardActions>)
}

Buttons.propTypes = {
    timerStep: PropTypes.string.isRequired,
    onStartPom: PropTypes.func.isRequired,
    onStopPom: PropTypes.func.isRequired,
    onStartBreak: PropTypes.func.isRequired,
    onStopBreak: PropTypes.func.isRequired,
    onBackToList: PropTypes.func.isRequired,
}

const TimerText = ({ timer, timerStep }) => {
    if (timerStep !== 'inPom' && timerStep !== 'inBreak') return null
    const secondsRemaining = timerStep === 'inPom' ?
        POMODORO_DURATION - timer.pomodoro :
        BREAK_DURATION - timer.currentBreak
    return (<CardText>
        {getTimeString(secondsRemaining)}
    </CardText>)
}

TimerText.propTypes = {
    timerStep: PropTypes.string.isRequired,
    timer: PropTypes.shape({
        pomodoro: PropTypes.number,
        currentBreak: PropTypes.number,
    })
}

const TimerCard = (props) => {
    const {
        task,
        timerStep,
        onStartPom,
        onStartBreak,
        onStopPom,
        onStopBreak,
        onBackToList,
        timer,
    } = props
    return (<Card>
        <CardHeader
            title={task.name}
            subtitle={`Estimated: ${task.estimatedPoms}, Actual: ${task.poms.completedCount}`}
        />
        <TimerText timerStep={timerStep} timer={timer} />
        <Buttons
            timerStep={timerStep}
            onStartPom={onStartPom}
            onStopPom={onStopPom}
            onStartBreak={onStartBreak}
            onStopBreak={onStopBreak}
            onBackToList={onBackToList}
        />
    </Card>)
}

TimerCard.fragments = {
    task: gql`
        fragment TimerCardTask on Task {
            id
            name
            estimatedPoms
            poms {
                completedCount
            }
            completed
        }
    `
}

TimerCard.propTypes = {
    timer: PropTypes.shape({
        pomodoro: PropTypes.number,
        currentBreak: PropTypes.number,
    }),
    timerStep: PropTypes.string.isRequired,
    onStartPom: PropTypes.func.isRequired,
    onStopPom: PropTypes.func.isRequired,
    onStartBreak: PropTypes.func.isRequired,
    onStopBreak: PropTypes.func.isRequired,
    onBackToList: PropTypes.func.isRequired,
    task: propType(TimerCard.fragments.task),
}

export default TimerCard
