import { graphql } from 'react-apollo'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import ActiveTasksTable from '../components/active-tasks-table'
import { CurrentTasks } from '../queries'
import { UpdateTask } from '../mutations'

const withUpdateTask = graphql(UpdateTask, {
    props: ({ mutate }) => ({
        updateTask: (id, task) => {
            return mutate({
                variables: { id, task }
            })
        }
    })
})

const withTasks = graphql(CurrentTasks, {
    props: ({ data: { taskList: tasks, loading, error } }) => {
        if (error) throw new Error(error)
        return {
            loading,
            tasks
        }
    }
})
const backToPlanning = () => push('/tasks')
const startTask = id => push(`/tasks/${id}`)

const withRedux = connect(() => ({}), {
    backToPlanning,
    startTask
})

export default withRedux(withUpdateTask(withTasks(ActiveTasksTable)))
