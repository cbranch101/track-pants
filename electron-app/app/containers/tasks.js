import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import update from 'immutability-helper'
import { connect } from 'react-redux'
import { startPomodoro } from '../actions/timer'
import TaskList from '../components/task-list'

update.extend('$unset', (keysToRemove, original) => {
    const copy = Object.assign({}, original)
    for (const key of keysToRemove) delete copy[key]
    return copy
});


const TaskQuery = gql`
    query CurrentTasks {
        taskList {
            ...TaskList
        }
    }
    ${TaskList.fragments.task}
`

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
const withTasks = graphql(TaskQuery, {
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
                updateQueries: {
                    CurrentTasks: (prev, { mutationResult }) => {
                        const newTask = mutationResult.data.createTask
                        return update(prev, {
                            taskList: {
                                $push: [newTask],
                            },
                        })
                    },
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
                updateQueries: {
                    CurrentTasks: (prev, { mutationResult }) => {
                        const removedId = mutationResult.data.removeTask
                        return update(prev, {
                            taskList: {
                                $set: prev.taskList.filter(
                                    task => task.id !== removedId
                                )
                            },
                        })
                    },
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

const withRedux = connect(
    (state) => ({
        pomodoro: state.timer.pomodoro,
    }),
    {
        startTask: startPomodoro,
    }
)


export default withRedux(withUpdateTask(withRemoveTask(withCreateTask(withTasks(TaskList)))))
