import React from 'react'
import PropTypes from 'prop-types'
import DoneIcon from 'material-ui/svg-icons/action/done'
import { green200 } from 'material-ui/styles/colors'
import { ListItem } from 'material-ui/List'
import gql from 'graphql-tag'
import { propType } from 'graphql-anywhere'
import { formatAsClockTime, isOnDay } from '../../utils/time'

import PomStatusIcons from './pom-status-icons'

const getHoursAndMinutes = seconds => {
    const hours = Math.floor(seconds / (60 * 60))
    const remainingMinutes = Math.floor((seconds - hours * 60 * 60) / 60)
    const minuteString = `${remainingMinutes} mins`
    const hourDescription = hours === 1 ? 'hour' : 'hours'
    return hours > 0 ? `${hours} ${hourDescription} ${minuteString}` : minuteString
}

const getTotalTime = tasks => {
    return tasks.reduce((memo, task) => {
        const newValue = memo + task.duration
        return newValue
    }, 0)
}

const getTimeData = (task, dayValue) => {
    const pomsForToday = task.poms.byType.completed.filter(pom => isOnDay(pom.createdAt, dayValue))
    if (pomsForToday.length === 0) return undefined
    const lastPom = pomsForToday[pomsForToday.length - 1]
    return {
        minTime: formatAsClockTime(pomsForToday[0].createdAt),
        maxTime: formatAsClockTime(lastPom.createdAt + lastPom.duration),
        totalTime: getTotalTime(pomsForToday)
    }
}

const getPomTotals = day => {
    return day.tasks.reduce(
        (memo, task) => {
            const timeData = getTimeData(task, day.value)
            const totalTime = timeData ? timeData.totalTime : 0
            return {
                estimated: memo.estimated + task.estimatedPoms,
                completed: memo.completed + task.poms.completedCount,
                duration: memo.duration + totalTime
            }
        },
        {
            estimated: 0,
            completed: 0,
            duration: 0
        }
    )
}

const DaySummary = ({ day }) => {
    const pomTotals = getPomTotals(day)
    return (
        <ListItem
            primaryText={`${day.value} (Tracked: ${getHoursAndMinutes(pomTotals.duration)} mins Untracked: ${day.untracked} mins)`}
            secondaryText={`Estimated: ${pomTotals.estimated}, Completed: ${pomTotals.completed}`}
            initiallyOpen
            primaryTogglesNestedList
            nestedItems={day.tasks.map(task => {
                const timeData = getTimeData(task, day.value)
                return (
                    <ListItem
                        leftIcon={task.completed ? <DoneIcon color={green200} /> : undefined}
                        key={task.id}
                        primaryText={`${task.name} ${timeData.minTime} - ${timeData.maxTime} (${getHoursAndMinutes(timeData.totalTime)})`}
                        secondaryText={<PomStatusIcons task={task} dayValue={day.value} />}
                        secondaryTextLines={2}
                    />
                )
            })}
        />
    )
}

DaySummary.fragments = {
    task: gql`
        fragment DaySummary_task on Task {
            completed
            id
            name
            poms {
                byType {
                    completed {
                        duration
                        createdAt
                    }
                }
            }
            ...PomStatusIcons_task
        }
        ${PomStatusIcons.fragments.task}
    `
}

DaySummary.propTypes = {
    day: PropTypes.shape({
        value: PropTypes.string.isRequired,
        untracked: PropTypes.number.isRequired,
        tasks: PropTypes.arrayOf(propType(DaySummary.fragments.task)).isRequired
    })
}

export default DaySummary
