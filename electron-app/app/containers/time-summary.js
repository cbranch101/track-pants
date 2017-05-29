import { graphql } from 'react-apollo'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import TimeSummary from '../components/time-summary'
import { CurrentTasks } from '../queries'

const withTasks = graphql(CurrentTasks, {
    props: ({ data: { taskList: tasks, loading, error } }) => {
        if (error) throw new Error(error)
        return {
            loading,
            tasks
        }
    },
})


const startPlanning = () => push('/tasks')

const withRedux = connect(
    () => ({}),
    {
        startPlanning,
    }
)

export default withRedux(withTasks(TimeSummary))
