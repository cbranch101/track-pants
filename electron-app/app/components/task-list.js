import React, { PropTypes } from 'react'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const taskType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    estimatedPoms: PropTypes.number.isRequired,
    actualPoms: PropTypes.number,
})


const TaskList = ({ tasks, startTask, completeTask, editTask, deleteTask }) => (
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
            {tasks.map(
        (task) => {
            const { id, name, actualPoms = 0, estimatedPoms } = task
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
                        <IconButton onClick={() => editTask(id)}>
                            <FontIcon className="material-icons">mode_edit</FontIcon>
                        </IconButton>
                        <IconButton onClick={() => deleteTask(id)}>
                            <FontIcon className="material-icons">remove_circle</FontIcon>
                        </IconButton>
                    </TableRowColumn>
                </TableRow>
            )
        })}
        </TableBody>
    </Table>
  )

TaskList.propTypes = {
    tasks: PropTypes.arrayOf(taskType).isRequired,
    startTask: PropTypes.func.isRequired,
    completeTask: PropTypes.func.isRequired,
    editTask: PropTypes.func.isRequired,
    deleteTask: PropTypes.func.isRequired,
}

export default TaskList
