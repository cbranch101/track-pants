import React from 'react'
import PropTypes from 'prop-types'
import { TableRow as TableRowBase } from 'material-ui/Table'
import { green50, blue50, cyan50, purple50 } from 'material-ui/styles/colors'

const colorMap = {
    green: green50,
    blue: blue50,
    cyan: cyan50,
    purple: purple50,
}

const TableRow = ({ color, ...props }) => {
    const style = color ? { backgroundColor: colorMap[color] } : {}
    return <TableRowBase {...props} style={style} />
}

TableRow.propTypes = {
    color: PropTypes.string,
}

export default TableRow
