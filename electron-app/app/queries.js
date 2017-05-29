import gql from 'graphql-tag'
import AllTasksTable from './components/all-tasks-table'
import Timer from './components/timer'
import TimeSummary from './components/time-summary'


export const CurrentTasks = gql`
    query CurrentTasks($includeArchived: Boolean) {
        taskList(includeArchived: $includeArchived) {
            ...TimerTask
            ...AllTasksTable
            ...TimeSummary_task
        }
    }
    ${Timer.fragments.task}
    ${AllTasksTable.fragments.task}
    ${TimeSummary.fragments.task}
`

export const SelectedTask = gql`
    query SelectedTask($id: String) {
        task(id: $id) {
            ...TimerTask
        }
    }
    ${Timer.fragments.task}
`
