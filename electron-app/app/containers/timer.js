import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import update from 'immutability-helper'
import gql from 'graphql-tag'
import Timer from '../components/timer'
import { SelectedTask } from '../queries'
import { startPomodoro, stopPomodoro, startBreak, stopBreak } from '../actions/timer'


const withTask = graphql(SelectedTask, {
    options: ({ params }) => {
        const output = { variables: { id: params.taskID } }
        return output
    },
    props: ({ data: { task, loading } }) => {
        return {
            loading,
            task,
        }
    }
})

const UpdateTaskMutation = gql`
    mutation UpdateTask($id: String, $task: TaskInput) {
      updateTask(id:$id, task:$task) {
        id
        completed
        name
        estimatedPoms
      }
    }
`

const CreatePomMutation = gql`
    mutation CreatePom($pom: PomInput) {
      createPom(pom:$pom) {
          id
      }
    }
`

const withUpdateTask = graphql(UpdateTaskMutation, {
    props: ({ mutate }) => ({
        updateTask: (id, task) => {
            return mutate({
                variables: { id, task },
            })
        }
    })
})

const withCreatePom = graphql(CreatePomMutation, {
    props: ({ mutate }) => ({
        createPom: (pom) => {
            return mutate({
                variables: { pom },
                refetchQueries: ['CurrentTasks', 'SelectedTask'],
            })
        }
    })
})

const backToList = () => push('/tasks')

const withRedux = connect(
    (state) => ({
        timer: state.timer,
    }),
    {
        startPomodoro,
        stopPomodoro: (isCompleted) => {
            return stopPomodoro(isCompleted)
        },
        startBreak,
        stopBreak,
        backToList,
    }
)

export default withRedux(withCreatePom(withUpdateTask(withTask(Timer))))
