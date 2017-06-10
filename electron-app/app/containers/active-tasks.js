import { graphql } from 'react-apollo'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import ActiveTasksTable from '../components/active-tasks-table'
import { UpdateTask } from '../mutations'
import { withTasks } from '../enhancers'

const withUpdateTask = graphql(UpdateTask, {
    props: ({ mutate }) => ({
        updateTask: (id, task) => {
            return mutate({
                variables: { id, task }
            })
        }
    })
})

const backToPlanning = () => push('/tasks')
const startTask = id => push(`/tasks/${id}`)

const withRedux = connect(() => ({}), {
    backToPlanning,
    startTask
})

export default withRedux(withUpdateTask(withTasks(ActiveTasksTable)))
