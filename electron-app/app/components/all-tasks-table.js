import React from 'react'
import PropTypes from 'prop-types'
import { propType } from 'graphql-anywhere'
import gql from 'graphql-tag'

import TaskTable from './task-table'
import ClickableIcon from './clickable-icon'
import TaskName from './task-name'
import Footer from './all-tasks-table/footer'
import PomStatus from './pom-status'
import { getCurrentTimestamp } from '../utils/time'

const fragments = {
    task: gql`
        fragment AllTasksTable on Task {
            id
            name
            completed
            active
            archived
            poms {
                anyRecorded
            }
            ...PomStatusTask
        }
        ${PomStatus.fragments.task}
    `
}

class AllTasksTable extends React.Component {
    static propTypes = {
        tasks: PropTypes.arrayOf(propType(fragments.task)),
        loading: PropTypes.bool.isRequired,
        updateTask: PropTypes.func.isRequired,
        removeTask: PropTypes.func.isRequired,
        createTask: PropTypes.func.isRequired,
        startWorking: PropTypes.func.isRequired,
        backToSummary: PropTypes.func.isRequired
    }
    static fragments = fragments
    state = {
        editedTask: null
    }
    handleEditTask = ({ name, estimatedPoms, id }) => {
        this.setState({
            editedTask: {
                name,
                estimatedPoms,
                id
            }
        })
    }
    handleTaskNameChange = (event, value) => {
        this.setState({ editedTask: { ...this.state.editedTask, name: value } })
    }
    saveOrUpdateTask = ({ id, ...task }) => {
        if (id) return this.props.updateTask(id, task)
        return this.handleSubmitCreate(task)
    }
    handleSaveTask = () => {
        return this.saveOrUpdateTask(this.state.editedTask).then(() =>
            this.setState({
                editedTask: null
            })
        )
    }
    handleCreateTask = () => {
        this.setState({
            editedTask: {
                name: '',
                estimatedPoms: 1
            }
        })
    }
    handleEstimatedPomChange = (increment = true) => {
        const currentValue = this.state.editedTask.estimatedPoms
        const newValue = increment ? currentValue + 1 : currentValue - 1
        this.setState({ editedTask: { ...this.state.editedTask, estimatedPoms: newValue } })
    }
    handleToggleActiveTask = task => {
        const { active } = task
        this.props.updateTask(task.id, {
            active: !active
        })
    }
    handleDelete = task => {
        if (task.poms.anyRecorded) {
            this.props.updateTask(task.id, {
                archived: true,
                active: false
            })
        } else {
            this.props.removeTask(task.id)
        }
    }
    handleSubmitCreate = task => {
        const newTask = {
            ...task,
            createdAt: getCurrentTimestamp(),
            completed: false,
            active: false
        }
        return this.props.createTask(newTask)
    }
    handleCancelEdit = () => {
        this.setState({ editedTask: null })
    }
    taskIsBeingEdited = task => !!(this.state.editedTask && this.state.editedTask.id === task.id)
    renderRow = (baseTask, Row, RowColumn) => {
        const isEdited = this.taskIsBeingEdited(baseTask) || baseTask.id === 'create-new'
        const task = isEdited ? { ...baseTask, ...this.state.editedTask } : baseTask
        const rowColor = isEdited ? 'purple' : task.active ? 'blue' : undefined
        return (
            <Row key={task.id} color={rowColor}>
                <RowColumn>
                    <TaskName
                        isEdited={isEdited}
                        value={task.name}
                        onChange={this.handleTaskNameChange}
                        onSubmitEdit={this.handleSaveTask}
                        onCancelEdit={this.handleCancelEdit}
                    />
                </RowColumn>
                <RowColumn>
                    <PomStatus
                        task={task}
                        onPomChange={this.handleEstimatedPomChange}
                        isEdited={isEdited}
                    />
                </RowColumn>
                <RowColumn>
                    {this.state.editedTask === null
                        ? <div>
                            <ClickableIcon
                                disabled={task.poms.anyRecorded}
                                name="mode_edit"
                                onClick={() => this.handleEditTask(task)}
                            />
                            <ClickableIcon
                                name="remove_circle"
                                onClick={() => this.handleDelete(task)}
                            />
                            <ClickableIcon
                                name={task.active ? 'alarm_off' : 'alarm_add'}
                                onClick={() => this.handleToggleActiveTask(task)}
                            />
                        </div>
                        : null}
                </RowColumn>
            </Row>
        )
    }
    render() {
        const { loading, tasks } = this.props
        if (loading) return <div>Loading</div>
        const allTasks = this.state.editedTask !== null
            ? [
                ...tasks,
                {
                    id: 'create-new',
                    ...this.state.editedTask
                }
            ]
            : tasks
        return (
            <TaskTable
                getFooter={() => {
                    return (
                        <Footer
                            isEdited={this.state.editedTask !== null}
                            onCreate={this.handleCreateTask}
                            onCancelEdit={this.handleCancelEdit}
                            onSubmitEdit={this.handleSaveTask}
                            onStartWorking={
                                tasks.filter(task => task.active).length > 0
                                    ? this.props.startWorking
                                    : undefined
                            }
                            onBackToSummary={this.props.backToSummary}
                        />
                    )
                }}
            >
                {({ Body, Row, RowColumn }) => {
                    return (
                        <Body displayRowCheckbox={false}>
                            {allTasks
                                .filter(task => !task.archived && !task.completed)
                                .map(task => this.renderRow(task, Row, RowColumn))}
                        </Body>
                    )
                }}
            </TaskTable>
        )
    }
}

export default AllTasksTable
