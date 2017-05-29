import React from 'react'
import PropTypes from 'prop-types'
import { List } from 'material-ui/List'
import moment from 'moment'
import gql from 'graphql-tag'
import { propType } from 'graphql-anywhere'
import RaisedButton from 'material-ui/RaisedButton'
import {
    timeStampToDateString,
    dateStringToMoment,
} from '../utils/time'

import DaySummary from './time-summary/day-summary'

const convertTasksToDays = tasks => {
    const indexedTasks = tasks.reduce((memo, task) => {
        memo[task.id] = task
        return memo
    }, {})

    const lastDayByTaskID = tasks.reduce((memo, task) => {
        const { completed } = task.poms.byType
        if (completed.length === 0) {
            return memo
        }
        const lastTime = completed[completed.length - 1].createdAt
        memo[task.id] = timeStampToDateString(lastTime)
        return memo
    }, {})
    const tasksByDay = tasks.reduce((memo, task) => {
        task.poms.byType.completed.forEach(pom => {
            const dayString = timeStampToDateString(pom.createdAt)
            if (!memo[dayString]) {
                memo[dayString] = []
            }
            if (!memo[dayString].includes(task.id)) {
                memo[dayString].push(task.id)
            }
        })
        return memo
    }, {})
    return Object.keys(tasksByDay)
        .map(dayString => {
            const taskIDs = tasksByDay[dayString]
            return {
                value: dayString,
                tasks: taskIDs.map(id => {
                    const task = indexedTasks[id]
                    if (lastDayByTaskID[id] !== dayString) {
                        return {
                            ...task,
                            completed: false
                        }
                    }
                    return task
                })
            }
        })
        .sort((a, b) => dateStringToMoment(b.value).valueOf() - dateStringToMoment(a.value).valueOf())
}

const TimeSummary = ({ tasks, startPlanning, loading }) => {
    if(loading) return <div>Loading</div>
    const days = convertTasksToDays(tasks)
    return (
        <div>
            <List>
                {days.map(day => <DaySummary key={day.value} day={day} />)}
            </List>
            <RaisedButton primary onClick={startPlanning}>Start Planning</RaisedButton>
        </div>
    )
}

TimeSummary.fragments = {
    task: gql`
        fragment TimeSummary_task on Task {
            id
            poms {
                byType {
                    completed {
                        createdAt
                    }
                }
            }
            ...DaySummary_task
        }
        ${DaySummary.fragments.task}
    `
}

TimeSummary.propTypes = {
    tasks: PropTypes.arrayOf(propType(TimeSummary.fragments.task)),
    startPlanning: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
}

export default TimeSummary
