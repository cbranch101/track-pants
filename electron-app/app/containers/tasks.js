import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { push } from 'react-router-redux';
import update from 'immutability-helper'
import { connect } from 'react-redux'
import TaskList from '../components/task-list'
import { CurrentTasks } from '../queries'

update.extend('$unset', (keysToRemove, original) => {
    const copy = Object.assign({}, original)
    for (const key of keysToRemove) delete copy[key]
    return copy
});


const UpdateTaskMutation = gql`
    mutation UpdateTask($id: String, $task: TaskInput) {
      updateTask(id:$id, task:$task) {
        id,
        name
        estimatedPoms
      }
    }
`

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
    props: ({ data, data: { taskList: tasks, loading, error } }) => {
        return {
            loading,
            tasks,
            completeTask: (id) => console.log(`completing ${id}`),
            editTask: (id) => console.log(`editing ${id}`),
            deleteTask: (id) => console.log(`deleting ${id}`),
        }
    }
})

const withCreateTask = graphql(CreateTaskMutation, {
    props: ({ mutate }) => ({
        createTask: (task) => {
            return mutate({
                variables: { task },
                update: (store, { data: { createTask: newTask } }) => {
                    const current = store.readQuery({ query: CurrentTasks })
                    const data = update(current, {
                        taskList: {
                            $push: [{
                                ...newTask,
                                __typename: 'Task',
                                completed: false,
                                poms: {
                                    __typename: 'PomIndex',
                                    completed: [],
                                },
                            }],
                        },
                    })
                    store.writeQuery({ query: CurrentTasks, data })
                },
            })
        }
    })
})

const withRemoveTask = graphql(RemoveTaskMutation, {
    props: ({ mutate }) => ({
        removeTask: (id) => {
            return mutate({
                variables: { id },
                update: (store, { data: { removeTask: removedId } }) => {
                    const current = store.readQuery({ query: CurrentTasks })
                    const data = update(current, {
                        taskList: {
                            $set: current.taskList.filter(
                                task => task.id !== removedId
                            )
                        },
                    })
                    store.writeQuery({ query: CurrentTasks, data })
                },
            })
        }
    })
})

const withUpdateTask = graphql(UpdateTaskMutation, {
    props: ({ mutate }) => ({
        updateTask: (id, task) => {
            return mutate({
                variables: { id, task },
            })
        }
    })
})

const startTask = (id) => push(`/tasks/${id}`)

const withRedux = connect(
    (state) => ({
        pomodoro: state.timer.pomodoro,
    }),
    {
        startTask,
        push,
    }
)


export default withRedux(withUpdateTask(withRemoveTask(withCreateTask(withTasks(TaskList)))))
