import React from 'react'
import PropTypes from 'prop-types'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'

const ClickableIcon = ({ onClick, name, disabled = false }) => {
    return (
        <IconButton disabled={disabled} onClick={onClick}>
            <FontIcon className="material-icons">{ name }</FontIcon>
        </IconButton>
    )
}

ClickableIcon.propTypes = {
    onClick: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
}

export default ClickableIcon
