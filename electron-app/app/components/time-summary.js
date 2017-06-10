import React from 'react'
import PropTypes from 'prop-types'
import { List } from 'material-ui/List'
import _ from 'lodash'
import gql from 'graphql-tag'
import { propType } from 'graphql-anywhere'
import RaisedButton from 'material-ui/RaisedButton'
import { timeStampToDateString, dateStringToMoment } from '../utils/time'

import DaySummary from './time-summary/day-summary'

const convertTasksToDays = (tasks, untrackedDays) => {
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
            const untrackedDay = untrackedDays.find(day => day.dateString === dayString)
            return {
                value: dayString,
                untracked: untrackedDay ? untrackedDay.minutes : 0,
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
        .sort(
            (a, b) => dateStringToMoment(b.value).valueOf() - dateStringToMoment(a.value).valueOf()
        )
}

const paginateDays = (days, cursor) => {
    const startIndex = cursor ? _.findIndex(days, day => day.value === cursor) + 1 : 0
    const currentIndex = startIndex + 5
    const hasMore = currentIndex < days.length
    return {
        results: _.take(days, currentIndex),
        hasMore
    }
}

const fragments = {
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
    `,
    untrackedDay: gql`
        fragment TimeSummary_untrackedDay on UntrackedDay {
            dateString
            minutes
        }
    `
}

class TimeSummary extends React.Component {
    static fragments = fragments
    state = {
        cursor: undefined
    }
    getPaginatedDays = () => {
        return paginateDays(
            convertTasksToDays(this.props.tasks, this.props.untrackedDays),
            this.state.cursor
        )
    }
    handleLoadMore = () => {
        const paginatedDays = this.getPaginatedDays()
        const { results } = paginatedDays
        const cursor = _.last(results).value
        this.setState({ cursor })
    }
    render = () => {
        const { startPlanning, loading, untrackedDaysLoading } = this.props
        if (loading || untrackedDaysLoading) return <div>Loading</div>
        const paginatedDays = this.getPaginatedDays()
        return (
            <div>
                <List>
                    {paginatedDays.results.map(day => <DaySummary key={day.value} day={day} />)}
                </List>
                {paginatedDays.hasMore
                    ? <RaisedButton secondary onClick={this.handleLoadMore}>Load More</RaisedButton>
                    : null}
                <RaisedButton primary onClick={startPlanning}>Start Planning</RaisedButton>
            </div>
        )
    }
}

TimeSummary.propTypes = {
    tasks: PropTypes.arrayOf(propType(TimeSummary.fragments.task)),
    untrackedDays: PropTypes.arrayOf(propType(TimeSummary.fragments.untrackedDay)),
    startPlanning: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    untrackedDaysLoading: PropTypes.bool.isRequired
}

export default TimeSummary
