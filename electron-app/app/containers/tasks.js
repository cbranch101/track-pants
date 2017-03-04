import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import update from 'immutability-helper'

import TaskList from '../components/task-list'

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
    props: ({ data: { taskList: tasks, loading } }) => {
        return {
            loading,
            tasks,
            startTask: (id) => console.log(`starting ${id}`),
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

const withUpdateTask = graphql(UpdateTaskMutation, {
    props: ({ mutate }) => ({
        updateTask: (id, task) => {
            return mutate({
                variables: { id, task },
            })
        }
    })
})

export default withUpdateTask(withCreateTask(withTasks(TaskList)))
