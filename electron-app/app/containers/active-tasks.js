import { graphql } from 'react-apollo'
import { push } from 'react-router-redux';
import { connect } from 'react-redux'
import ActiveTasksTable from '../components/active-tasks-table'
import { CurrentTasks } from '../queries'
import { UpdateTask } from '../mutations'


const withUpdateTask = graphql(UpdateTask, {
    props: ({ mutate }) => ({
        updateTask: (id, task) => {
            return mutate({
                variables: { id, task },
            })
        }
    })
})


const withTasks = graphql(CurrentTasks, {
    props: ({ data, data: { taskList: tasks, loading, error } }) => {
        console.log(error)
        return {
            loading,
            tasks,
            completeTask: (id) => console.log(`completing ${id}`),
            editTask: (id) => console.log(`editing ${id}`),
            deleteTask: (id) => console.log(`deleting ${id}`),
        }
    }
})
const backToPlanning = () => push('/tasks')
const startTask = (id) => push(`/tasks/${id}`)

const withRedux = connect(
    () => ({}),
    {
        backToPlanning,
        startTask,
    }
)


export default withRedux(withUpdateTask(withTasks(ActiveTasksTable)))
