import gql from 'graphql-tag'
import TaskList from './components/task-list'
import Timer from './components/timer'


export const CurrentTasks = gql`
    query CurrentTasks {
        taskList {
            ...TaskList
            ...TimerTask
        }
    }
    ${Timer.fragments.task}
    ${TaskList.fragments.task}
`

export const SelectedTask = gql`
    query SelectedTask($id: String) {
        task(id: $id) {
            ...TimerTask
        }
    }
    ${Timer.fragments.task}
`
