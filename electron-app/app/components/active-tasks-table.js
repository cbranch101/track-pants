import React from 'react'
import FlatButton from 'material-ui/FlatButton'
import PropTypes from 'prop-types'
import { propType } from 'graphql-anywhere'
import gql from 'graphql-tag'

import TaskTable from './task-table'
import ClickableIcon from './clickable-icon'
import PomStatus from './pom-status'

const fragments = {
    task: gql`
        fragment TaskList on Task {
            id
            name
            completed
            ...PomStatusTask
        }
        ${PomStatus.fragments.task}
    `
}


class ActiveTasksTable extends React.Component {
    static propTypes = {
        tasks: PropTypes.arrayOf(propType(fragments.task)),
        loading: PropTypes.bool.isRequired,
        updateTask: PropTypes.func.isRequired,
        startTask: PropTypes.func.isRequired,
        backToPlanning: PropTypes.func.isRequired,
    }
    handleToggleCompleted = (task) => {
        this.props.updateTask(task.id, { completed: !task.completed })
    }
    renderRow = (task, Row, RowColumn) => {
        const { completed } = task
        return (
            <Row key={task.id} color={task.completed ? 'green' : undefined}>
                <RowColumn>{task.name}</RowColumn>
                <RowColumn><PomStatus task={task} /></RowColumn>
                <RowColumn>
                    {completed ? null : <ClickableIcon name="play_arrow" onClick={() => this.props.startTask(task.id)} />}
                    <ClickableIcon name={completed ? 'eject' : 'done'} onClick={() => this.handleToggleCompleted(task)} />
                </RowColumn>
            </Row>

        )
    }
    render() {
        const { loading, tasks } = this.props
        if (loading) return <div>Loading</div>
        return (<TaskTable
            getFooter={() => {
                return <FlatButton onClick={this.props.backToPlanning}>Back to Planning</FlatButton>
            }}
        >
            {({ Body, Row, RowColumn }) => {
                return (
                    <Body displayRowCheckbox={false}>
                        {tasks.filter(task => task.active)
                            .map((task) => this.renderRow(task, Row, RowColumn))}
                    </Body>
                )
            }}
        </TaskTable>)
    }
}

export default ActiveTasksTable
