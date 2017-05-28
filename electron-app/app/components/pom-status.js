import React from 'react'
import { propType } from 'graphql-anywhere'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import ClickableIcon from './clickable-icon'


const PomStatus = ({ task, isEdited = false, onPomChange }) => {
    const { estimatedPoms } = task
    const { completedCount } = task.poms
    if (isEdited) {
        return (
            <span>
                <ClickableIcon disabled={estimatedPoms <= 1}name="remove_circle" onClick={() => onPomChange(false)} />
                {estimatedPoms}
                <ClickableIcon disabled={estimatedPoms >= 8}name="add_circle" onClick={() => onPomChange(true)} />
            </span>
        )
    }
    return <span>{completedCount}/{task.estimatedPoms}</span>
}

PomStatus.fragments = {
    task: gql`
        fragment PomStatusTask on Task {
            poms {
                completedCount,
            }
            estimatedPoms
        }
    `
}

PomStatus.propTypes = {
    task: propType(PomStatus.fragments),
    isEdited: PropTypes.bool,
    onPomChange: PropTypes.func,
}

export default PomStatus
