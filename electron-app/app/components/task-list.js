import React, { PropTypes } from 'react'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import gql from 'graphql-tag'

const taskType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    estimatedPoms: PropTypes.number.isRequired,
    actualPoms: PropTypes.number,
})

class TaskList extends React.Component {
    static propTypes = {
        tasks: PropTypes.arrayOf(taskType),
        loading: PropTypes.bool.isRequired,
        startTask: PropTypes.func.isRequired,
        completeTask: PropTypes.func.isRequired,
        updateTask: PropTypes.func.isRequired,
        deleteTask: PropTypes.func.isRequired,
        createTask: PropTypes.func.isRequired,
    }
    state = {
        editedTask: null,
    }
    handleEditTask = (editedTask) => {
        this.setState({ editedTask })
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
    saveOrUpdateTask = ({ id, name, estimatedPoms }) => {
        const task = {
            name,
            estimatedPoms
        }
        if (id) return this.props.updateTask(id, task)
        return this.props.createTask(task)
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

        const getEditedTaskRow = (task) => (
            <TableRow key={task.id || 'create-new'}>
                <TableRowColumn>
                    <TextField
                        fullWidth
                        hintText={'Describe Task'}
                        value={task.name}
                        onChange={this.handleTaskNameChange}
                    />
                </TableRowColumn>
                <TableRowColumn>
                    <IconButton onClick={() => this.handleEstimatedPomChange(true)}>
                        <FontIcon className="material-icons">add_circle</FontIcon>
                    </IconButton>
                    {task.estimatedPoms}
                    <IconButton onClick={() => this.handleEstimatedPomChange(false)}>
                        <FontIcon className="material-icons">remove_circle</FontIcon>
                    </IconButton>
                </TableRowColumn>
                <TableRowColumn>
                    <FlatButton onClick={this.handleSaveTask}>Save</FlatButton>
                    <FlatButton onClick={this.handleCancelEdit}>Cancel</FlatButton>
                </TableRowColumn>
            </TableRow>
        )

        const getTaskRow = (task) => {
            const { id, name, actualPoms = 0, estimatedPoms } = task
            if (this.state.editedTask && this.state.editedTask.id === id) {
                return getEditedTaskRow({ ...task, ...this.state.editedTask })
            }
            return (
                <TableRow key={id}>
                    <TableRowColumn>{name}</TableRowColumn>
                    <TableRowColumn>{actualPoms} / {estimatedPoms}</TableRowColumn>
                    <TableRowColumn>
                        <IconButton onClick={() => startTask(id)}>
                            <FontIcon className="material-icons">play_arrow</FontIcon>
                        </IconButton>
                        <IconButton onClick={() => completeTask(id)}>
                            <FontIcon className="material-icons">check_circle</FontIcon>
                        </IconButton>
                        <IconButton onClick={() => this.handleEditTask(task)}>
                            <FontIcon className="material-icons">mode_edit</FontIcon>
                        </IconButton>
                        <IconButton onClick={() => deleteTask(id)}>
                            <FontIcon className="material-icons">remove_circle</FontIcon>
                        </IconButton>
                    </TableRowColumn>
                </TableRow>
            )
        }


        const rows = tasks.map(getTaskRow)
        const bottomRow = editedTask && !editedTask.id ? getEditedTaskRow(editedTask) : createNewRow
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

TaskList.fragments = {
    task: gql`
        fragment TaskList on Task {
            id
            name
            estimatedPoms
        }
    `
}

export default TaskList
