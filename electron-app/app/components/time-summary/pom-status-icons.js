import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import FontIcon from 'material-ui/FontIcon'
import { green200, red200 } from 'material-ui/styles/colors'
import _ from 'lodash'
import gql from 'graphql-tag'
import { propType } from 'graphql-anywhere'
import {
    isOnDay,
    isBeforeDay,
} from '../../utils/time'

const BaseIcon = ({ color, name }) => <FontIcon className="material-icons" color={color}>{name}</FontIcon>
BaseIcon.propTypes = {
    color: PropTypes.string,
    name: PropTypes.string.isRequired,
}

const CompletedIcon = () => <BaseIcon color={green200} name="check_box" />
const ExtraIcon = () => <BaseIcon color={red200} name="check_box" />
const ExtraBeforeIcon = () => <BaseIcon color={red200} name="check_circle" />
const CompletedBeforeIcon = () => <BaseIcon color={green200} name="check_circle" />
const IncompleteIcon = () => <BaseIcon name="check_box_outline_blank" />

const addItemNTimes = (n, array, item) => {
    const runArray = _.fill(Array(n), 2)
    runArray.forEach(() => array.push(item))
    return array
}

const getPomIcons = (task, dayValue) => {
    const estimatedCount = task.estimatedPoms
    const baseIcons = task.poms.byType.completed.map(
        (pom, index) => {
            const { createdAt } = pom
            const currentCount = index + 1
            if (isBeforeDay(createdAt, dayValue)) {
                return currentCount > estimatedCount ? ExtraBeforeIcon : CompletedBeforeIcon
            }
            if (isOnDay(createdAt, dayValue)) {
                return currentCount > estimatedCount ? ExtraIcon : CompletedIcon
            }
            return null
        }).filter(value => value)
    if (baseIcons.length >= estimatedCount) {
        return baseIcons
    }
    return addItemNTimes(estimatedCount - baseIcons.length, baseIcons, IncompleteIcon)
}

const PomStatusIcons = ({ task, dayValue }) => {
    return (
        <p>
            <span>
                {getPomIcons(task, dayValue).map((Icon, index) => {
                    return <Icon key={index} />
                })}
            </span>
        </p>
    )
}

PomStatusIcons.fragments = {
    task: gql`
        fragment PomStatusIcons_task on Task {
            estimatedPoms
            poms {
                byType {
                    completed {
                        createdAt
                    }
                }
            }
        }
    `
}

PomStatusIcons.propTypes = {
    task: propType(PomStatusIcons.fragments.task),
    dayValue: PropTypes.string.isRequired,
}

export default PomStatusIcons
