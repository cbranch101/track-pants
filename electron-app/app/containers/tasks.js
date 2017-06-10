import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { push } from 'react-router-redux'
import update from 'immutability-helper'
import { connect } from 'react-redux'

import { withTasks } from '../enhancers'
import AllTasksTable from '../components/all-tasks-table'
import Timer from '../components/timer'
import TimeSummary from '../components/time-summary'
import { CurrentTasks } from '../queries'
import { UpdateTask } from '../mutations'

update.extend('$unset', (keysToRemove, original) => {
    const copy = Object.assign({}, original)
    Object.keys(keysToRemove).forEach(key => delete copy[key])
    return copy
})

const RemoveTaskMutation = gql`
    mutation DeleteTask($id: String) {
        removeTask(id:$id)
    }
`

const CreateTaskMutation = gql`
    mutation CreateTask($task: TaskInput) {
          createTask(task:$task) {
              ...TimerTask
              ...AllTasksTable
              ...TimeSummary_task
        }
    }
    ${Timer.fragments.task}
    ${AllTasksTable.fragments.task}
    ${TimeSummary.fragments.task}
`

const withCreateTask = graphql(CreateTaskMutation, {
    props: ({ mutate }) => ({
        createTask: task => {
            return mutate({
                variables: { task },
                update: (store, { data: { createTask: newTask } }) => {
                    const current = store.readQuery({ query: CurrentTasks })
                    const data = update(current, {
                        taskList: {
                            $push: [newTask]
                        }
                    })
                    store.writeQuery({ query: CurrentTasks, data })
                }
            })
        }
    })
})

const withRemoveTask = graphql(RemoveTaskMutation, {
    props: ({ mutate }) => ({
        removeTask: id => {
            return mutate({
                variables: { id },
                update: (store, { data: { removeTask: removedId } }) => {
                    const current = store.readQuery({ query: CurrentTasks })
                    const data = update(current, {
                        taskList: {
                            $set: current.taskList.filter(task => task.id !== removedId)
                        }
                    })
                    store.writeQuery({ query: CurrentTasks, data })
                }
            })
        }
    })
})

const withUpdateTask = graphql(UpdateTask, {
    props: ({ mutate }) => ({
        updateTask: (id, task) => {
            return mutate({
                variables: { id, task }
            })
        }
    })
})

const startWorking = () => push('/active-tasks')
const backToSummary = () => push('/time-summary')

const withRedux = connect(
    state => ({
        pomodoro: state.timer.pomodoro
    }),
    {
        startWorking,
        backToSummary,
        push
    }
)

export default withRedux(withUpdateTask(withRemoveTask(withCreateTask(withTasks(AllTasksTable)))))
