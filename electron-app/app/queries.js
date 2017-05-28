import gql from 'graphql-tag'
import AllTasksTable from './components/all-tasks-table'
import Timer from './components/timer'


export const CurrentTasks = gql`
    query CurrentTasks {
        taskList {
            ...TimerTask
            ...AllTasksTable
        }
    }
    ${Timer.fragments.task}
    ${AllTasksTable.fragments.task}
`

export const SelectedTask = gql`
    query SelectedTask($id: String) {
        task(id: $id) {
            ...TimerTask
        }
    }
    ${Timer.fragments.task}
`
