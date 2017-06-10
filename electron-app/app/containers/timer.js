import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import gql from 'graphql-tag'
import Timer from '../components/timer'
import { SelectedTask } from '../queries'
import {
    startPomodoro,
    stopPomodoro,
    startBreak,
    stopBreak,
    startCountingUntracked,
    stopCountingUntracked
} from '../actions/timer'

const withTask = graphql(SelectedTask, {
    options: ({ params }) => {
        const output = { variables: { id: params.taskID } }
        return output
    },
    props: ({ data: { task, loading } }) => {
        return {
            loading,
            task
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

const PomFields = gql`
    fragment PomFields on Pom {
        interrupted
        taskID
    }
`

const CreatePomMutation = gql`
    mutation CreatePom($pom: PomInput) {
      createPom(pom:$pom) {
          ...PomFields
      }
    }
    ${PomFields}
`

const withUpdateTask = graphql(UpdateTaskMutation, {
    props: ({ mutate }) => ({
        updateTask: (id, task) => {
            return mutate({
                variables: { id, task }
            })
        }
    })
})

const TaskFragment = gql`
    fragment UpdatedTask on Task {
        poms {
            completedCount
        }
    }
`

const withCreatePom = graphql(CreatePomMutation, {
    props: ({ mutate }) => ({
        createPom: pom => {
            return mutate({
                variables: { pom },
                update: (store, { data: { createPom: newPom } }) => {
                    const currentTask = store.readFragment({
                        id: newPom.taskID,
                        fragment: TaskFragment
                    })
                    const updatedTask = {
                        ...currentTask,
                        poms: {
                            completedCount: newPom.interrupted
                                ? currentTask.poms.completedCount
                                : currentTask.poms.completedCount + 1
                        }
                    }
                    store.writeFragment({
                        id: newPom.taskID,
                        fragment: TaskFragment,
                        data: updatedTask
                    })
                }
            })
        }
    })
})

const backToList = () => push('/active-tasks')
const backToSummary = () => push('/time-summary')

const withRedux = connect(
    state => ({
        timer: state.timer
    }),
    {
        startPomodoro,
        stopPomodoro: isCompleted => {
            return stopPomodoro(isCompleted)
        },
        startBreak,
        stopBreak,
        startCountingUntracked,
        stopCountingUntracked,
        backToList,
        backToSummary
    }
)

export default withRedux(withCreatePom(withUpdateTask(withTask(Timer))))
