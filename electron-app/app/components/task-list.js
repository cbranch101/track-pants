import React, { PropTypes } from 'react'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

const TaskList = () => <Table>
  <TableHeader>
    <TableHeaderColumn>Task</TableHeaderColumn>
  </TableHeader>
</Table>

TaskList.propTypes = {

}

export default TaskList
