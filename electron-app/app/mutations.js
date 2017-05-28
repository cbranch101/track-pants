import gql from 'graphql-tag'

export const UpdateTask = gql`
    mutation UpdateTask($id: String, $task: TaskInput) {
      updateTask(id:$id, task:$task) {
        id,
        name
        estimatedPoms,
        active,
        completed,
      }
    }
`
