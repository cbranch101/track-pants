import React from 'react'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField';

class TaskName extends React.Component {
    static propTypes = {
        value: PropTypes.isRequired,
        isEdited: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
        onSubmitEdit: PropTypes.func.isRequired,
        onCancelEdit: PropTypes.func.isRequired,
    }
    handleKeyDown = (e) => {
        if (this.props.isEdited) {
            if (e.key === 'Enter') this.props.onSubmitEdit()
            if (e.key === 'Escape') this.props.onCancelEdit()
        }
    }
    render() {
        if (!this.props.isEdited) return <span>{this.props.value}</span>
        return (<TextField
            onKeyDown={this.handleKeyDown}
            fullWidth
            hintText={'Describe Task'}
            value={this.props.value}
            onChange={this.props.onChange}
        />)
    }
}

export default TaskName
