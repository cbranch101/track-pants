import FlatButton from 'material-ui/FlatButton'
import React from 'react'
import PropTypes from 'prop-types'

const AllTasksTableFooter = ({
    onCreate,
    onSubmitEdit,
    onCancelEdit,
    isEdited,
    onStartWorking
}) => {
    if (isEdited) {
        return (
            <div>
                <FlatButton onClick={onSubmitEdit}>Submit Task Changes</FlatButton>
                <FlatButton onClick={onCancelEdit}>Cancel Edit</FlatButton>
            </div>
        )
    }
    return (
        <div>
            <FlatButton onClick={onCreate}>Create New Task</FlatButton>
            {onStartWorking
                ? <FlatButton onClick={onStartWorking}>Start Working</FlatButton>
                : null
            }
        </div>
    )
}

AllTasksTableFooter.propTypes = {
    onCreate: PropTypes.func.isRequired,
    onSubmitEdit: PropTypes.func.isRequired,
    onCancelEdit: PropTypes.func.isRequired,
    isEdited: PropTypes.bool.isRequired,
    onStartWorking: PropTypes.func,
}


export default AllTasksTableFooter
