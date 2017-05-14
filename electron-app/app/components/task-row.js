import React, { PropTypes } from 'react'
import { TableRow, TableRowColumn } from 'material-ui/Table';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton'

class TaskRow extends React.Component {
    static propTypes = {
        edited: PropTypes.bool.isRequired,
        task: PropTypes.object.isRequired,
        onPomChange: PropTypes.func.isRequired,
        onTaskNameChange: PropTypes.func.isRequired,
        onEdit: PropTypes.func.isRequired,
        onSave: PropTypes.func.isRequired,
        onCancelEdit: PropTypes.func.isRequired,
        onDelete: PropTypes.func.isRequired,
        onStart: PropTypes.func.isRequired,
        onComplete: PropTypes.func.isRequired,
    }
    handleKeyDown = (e) => {
        if (this.props.edited) {
            if (e.key === 'Enter') this.props.onSave()
            if (e.key === 'Escape') this.props.onCancelEdit()
        }
    }
    handleStart = () => {
        this.props.onStart(this.props.task.id)
    }
    render() {
        const {
            id,
            name,
            poms: {
                completed: completedPoms,
            },
            estimatedPoms,
            completed,
        } = this.props.task
        const {
            onPomChange,
            onTaskNameChange,
            onEdit,
            onSave,
            onCancelEdit,
            onDelete,
            onStart,
            onComplete,
            edited,
            task,
        } = this.props
        if (edited) {
            return (<TableRow>
                <TableRowColumn>
                    <TextField
                        onKeyDown={this.handleKeyDown}
                        fullWidth
                        hintText={'Describe Task'}
                        value={task.name}
                        onChange={onTaskNameChange}
                    />
                </TableRowColumn>
                <TableRowColumn>
                    <IconButton onClick={() => onPomChange(true)}>
                        <FontIcon className="material-icons">add_circle</FontIcon>
                    </IconButton>
                    {task.estimatedPoms}
                    <IconButton onClick={() => onPomChange(false)}>
                        <FontIcon className="material-icons">remove_circle</FontIcon>
                    </IconButton>
                </TableRowColumn>
                <TableRowColumn>
                    <FlatButton onClick={onSave}>Save</FlatButton>
                    <FlatButton onClick={onCancelEdit}>Cancel</FlatButton>
                </TableRowColumn>
            </TableRow>)
        }
        return (
            <TableRow>
                <TableRowColumn>{name}</TableRowColumn>
                <TableRowColumn>{completedPoms.length} / {estimatedPoms}</TableRowColumn>
                <TableRowColumn>
                    <IconButton onClick={this.handleStart}>
                        <FontIcon className="material-icons">play_arrow</FontIcon>
                    </IconButton>
                    {completed ? <IconButton onClick={() => onComplete(id)}>
                        <FontIcon className="material-icons">check_circle</FontIcon>
                    </IconButton> : null}

                    <IconButton onClick={() => onEdit(task)}>
                        <FontIcon className="material-icons">mode_edit</FontIcon>
                    </IconButton>
                    <IconButton onClick={() => onDelete(id)}>
                        <FontIcon className="material-icons">remove_circle</FontIcon>
                    </IconButton>
                </TableRowColumn>
            </TableRow>
        )
    }
}

export default TaskRow
