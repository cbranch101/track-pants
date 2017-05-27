import React from 'react'
import { List, ListItem } from 'material-ui/List';
import { green } from 'material-ui/styles/colors';

const ActiveTasks = () => {
    return (
        <List>
            <ListItem primaryText="A Task Name" />
            <ListItem primaryText="Another Task Name" />
        </List>
    )
}

export default ActiveTasks
