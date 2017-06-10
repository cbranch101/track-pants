import { push } from 'react-router-redux'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { connect } from 'react-redux'
import { withTasks } from '../enhancers'
import TimeSummary from '../components/time-summary'

const startPlanning = () => push('/tasks')

const withRedux = connect(() => ({}), {
    startPlanning
})

const withUntrackedDays = graphql(
    gql`
        query UntrackedDayQuery {
            untrackedTimeByDay {
                ...TimeSummary_untrackedDay
            }
        }
        ${TimeSummary.fragments.untrackedDay}
    `,
    {
        props: ({ data: { untrackedTimeByDay, loading, error } }) => {
            if (error) throw new Error(error)
            return {
                untrackedDaysLoading: loading,
                untrackedDays: untrackedTimeByDay
            }
        }
    }
)

export default withRedux(withUntrackedDays(withTasks(TimeSummary)))
