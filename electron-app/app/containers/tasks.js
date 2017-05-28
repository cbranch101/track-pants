import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { push } from 'react-router-redux'
import update from 'immutability-helper'
import { connect } from 'react-redux'
import AllTasksTable from '../components/all-tasks-table'
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
        id
        name
        estimatedPoms
      }
    }
`
const withTasks = graphql(CurrentTasks, {
    props: ({ data: { taskList: tasks, loading, error } }) => {
        if (error) throw new Error(error)
        return {
            loading,
            tasks
        }
    }
})

const withCreateTask = graphql(CreateTaskMutation, {
    props: ({ mutate }) => ({
        createTask: task => {
            return mutate({
                variables: { task },
                update: (store, { data: { createTask: newTask } }) => {
                    const current = store.readQuery({ query: CurrentTasks })
                    const data = update(current, {
                        taskList: {
                            $push: [
                                {
                                    ...newTask,
                                    __typename: 'Task',
                                    completed: false,
                                    poms: {
                                        __typename: 'PomIndex',
                                        completed: []
                                    },
                                    active: false
                                }
                            ]
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

const withRedux = connect(
    state => ({
        pomodoro: state.timer.pomodoro
    }),
    {
        startWorking,
        push
    }
)

export default withRedux(withUpdateTask(withRemoveTask(withCreateTask(withTasks(AllTasksTable)))))
