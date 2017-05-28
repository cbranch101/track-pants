import React from 'react'
import { List, ListItem } from 'material-ui/List'
import DoneIcon from 'material-ui/svg-icons/action/check-circle'
import FontIcon from 'material-ui/FontIcon'
import { green200, red200 } from 'material-ui/styles/colors'
import moment from 'moment'
import _ from 'lodash'

const CompletedIcon = () => (
    <FontIcon className="material-icons" color={green200}>check_box</FontIcon>
)
const ExtraIcon = () => <FontIcon className="material-icons" color={red200}>check_box</FontIcon>
const IncompleteIcon = () => <FontIcon className="material-icons">check_box_outline_blank</FontIcon>

const addItemNTimes = (n, array, item) => {
    const runArray = _.fill(Array(n), 2)
    runArray.forEach(() => array.push(item))
    return array
}

const getPomIcons = task => {
    const iconArray = []
    const { completedCount } = task.poms
    const { estimatedPoms: estimatedCount } = task
    if (completedCount > 0) {
        const itemsToAdd = completedCount > estimatedCount ? estimatedCount : completedCount
        addItemNTimes(itemsToAdd, iconArray, CompletedIcon)
    }
    if (completedCount < estimatedCount) {
        addItemNTimes(estimatedCount - completedCount, iconArray, IncompleteIcon)
    }
    if (completedCount > estimatedCount) {
        addItemNTimes(completedCount - estimatedCount, iconArray, ExtraIcon)
    }
    return iconArray
}

const formatAsClockTime = time => moment(time).format('HH:mm')

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
    const currentDay = moment(dayValue)
    const pomsForToday = task.poms.byType.completed.filter(pom =>
        currentDay.isSame(moment(pom.createdAt), 'day')
    )
    if (pomsForToday.length === 0) return undefined
    const lastTask = pomsForToday[pomsForToday.length - 1]
    return {
        minTime: formatAsClockTime(pomsForToday[0].createdAt),
        maxTime: formatAsClockTime(lastTask.createdAt + lastTask.duration * 1000),
        totalTime: getTotalTime(pomsForToday),
    }
}

const getPomTotals = (day) => {
    return day.tasks.reduce(
        (memo, task) => {
            const timeData = getTimeData(task, day.value)
            const totalTime = timeData ? timeData.totalTime : 0
            return {
                estimated: memo.estimated + task.estimatedPoms,
                completed: memo.completed + task.poms.completedCount,
                duration: memo.duration + totalTime,
            }
        },
        {
            estimated: 0,
            completed: 0,
            duration: 0,
        }
    )
}

const DaySummary = ({ day }) => {
    const pomTotals = getPomTotals(day)
    const formattedDayValue = moment(day.value).format('MMMM Do YYYY')
    return (
        <ListItem
            primaryText={`${formattedDayValue} (${getHoursAndMinutes(pomTotals.duration)})`}
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
                        secondaryText={
                            <p>
                                <span>
                                    {getPomIcons(task).map((Icon, index) => {
                                        return <Icon key={index} />
                                    })}
                                </span>
                            </p>
                        }
                        secondaryTextLines={2}
                    />
                )
            })}
        />
    )
}

const TimeSummary = ({ days }) => {
    return (
        <List>
            {days.map(day => <DaySummary key={day.value} day={day} />)}
        </List>
    )
}

TimeSummary.propTypes = {}

export default TimeSummary
