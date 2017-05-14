// @flow
import React from 'react'
import { Route, IndexRedirect } from 'react-router'
import App from './containers/App'
import Tasks from './containers/tasks'
import CreateTask from './containers/create-task'
import Timer from './containers/timer'

export default (
    <Route path="/" component={App}>
        <IndexRedirect to="/tasks" />
        <Route path="tasks" component={Tasks} />
        <Route path="tasks/:taskID" component={Timer} />
    </Route>
)
