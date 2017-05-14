import React, { PropTypes } from 'react'
import gql from 'graphql-tag'
import { propType } from 'graphql-anywhere'
import FlatButton from 'material-ui/FlatButton'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

import TaskRow from './task-row'


const fragments = {
    task: gql`
        fragment TaskList on Task {
            id
            name
            estimatedPoms
            completed
            poms {
                completed {
                    id
                }
            }
        }
    `
}

class TaskList extends React.Component {
    static fragments = fragments
    static propTypes = {
        tasks: PropTypes.arrayOf(propType(fragments.task)),
        loading: PropTypes.bool.isRequired,
        startTask: PropTypes.func.isRequired,
        completeTask: PropTypes.func.isRequired,
        updateTask: PropTypes.func.isRequired,
        removeTask: PropTypes.func.isRequired,
        createTask: PropTypes.func.isRequired,
    }
    state = {
        editedTask: null,
    }
    handleEditTask = ({ name, estimatedPoms, id }) => {
        this.setState({
            editedTask: {
                name,
                estimatedPoms,
                id,
            },
        })
    }
    handleTaskNameChange = (event, value) => {
        this.setState({ editedTask: { ...this.state.editedTask, name: value } })
    }
    handleCancelEdit = () => {
        this.setState({ editedTask: null })
    }
    handleEstimatedPomChange = (increment = true) => {
        const currentValue = this.state.editedTask.estimatedPoms
        const newValue = increment ? currentValue + 1 : currentValue - 1
        this.setState({ editedTask: { ...this.state.editedTask, estimatedPoms: newValue } })
    }
    handleCreateTask = () => {
        this.setState({ editedTask: {
            name: '',
            estimatedPoms: 1,
        } })
    }
    handleDelete = (id) => {
        this.props.removeTask(id)
    }
    saveOrUpdateTask = ({ id, ...task }) => {
        if (id) return this.props.updateTask(id, task)
        return this.handleSubmitCreate(task)
    }
    handleSubmitCreate = (task) => {
        const newTask = {
            ...task,
            createdAt: Date.now() / 1000,
            completed: false,
        }
        return this.props.createTask(newTask)
    }
    handleSaveTask = () => {
        return this.saveOrUpdateTask(this.state.editedTask).then(
            () => this.setState({
                editedTask: null
            })
        )
    }
    render() {
        const { tasks, startTask, completeTask, editTask, deleteTask, loading } = this.props
        const { editedTask } = this.state


        const createNewRow = (<TableRow key={'create-new'}>
            <TableRowColumn>
                <FlatButton onClick={this.handleCreateTask}>Create New Task</FlatButton>
            </TableRowColumn>
            <TableRowColumn />
            <TableRowColumn />
        </TableRow>)

        const getTaskRow = (task, edited) => {
            return (<TaskRow
                key={task.id || 'create-new'}
                edited={edited}
                task={task}
                onStart={startTask}
                onComplete={completeTask}
                onEdit={this.handleEditTask}
                onSave={this.handleSaveTask}
                onCancelEdit={this.handleCancelEdit}
                onDelete={this.handleDelete}
                onPomChange={this.handleEstimatedPomChange}
                onTaskNameChange={this.handleTaskNameChange}
            />)
        }


        const rows = tasks ? tasks.map(
            task => {
                const edited = !!(this.state.editedTask && this.state.editedTask.id === task.id)
                const finalTask = edited ? { ...task, ...this.state.editedTask } : task
                return getTaskRow(finalTask, edited)
            }
        ) : []
        const bottomRow = editedTask && !editedTask.id ? getTaskRow(editedTask, true) : createNewRow
        const rowsWithButton = [...rows, bottomRow]
        if (loading) return <div>Loading</div>
        return (
            <div>

                <Table
                    selectable={false}
                >
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn>Task</TableHeaderColumn>
                            <TableHeaderColumn>Pomodoros</TableHeaderColumn>
                            <TableHeaderColumn>Actions</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {
                            rowsWithButton
                        }
                    </TableBody>
                </Table>
            </div>
        )
    }
}

export default TaskList
