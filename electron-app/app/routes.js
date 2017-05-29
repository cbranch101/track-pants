// @flow
import React from 'react'
import { Route, IndexRedirect } from 'react-router'
import App from './components/app'
import Tasks from './containers/tasks'
import ActiveTasks from './containers/active-tasks'
import Timer from './containers/timer'
import TimeSummary from './containers/time-summary'

export default (
    <Route path="/" component={App}>
        <IndexRedirect to="/tasks" />
        <Route path="time-summary" component={TimeSummary} />
        <Route path="tasks" component={Tasks} />
        <Route path="active-tasks" component={ActiveTasks} />
        <Route path="tasks/:taskID" component={Timer} />
    </Route>
)
