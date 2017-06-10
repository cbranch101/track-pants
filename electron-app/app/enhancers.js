import { graphql } from 'react-apollo'
import { CurrentTasks } from './queries'

export const withTasks = graphql(CurrentTasks, {
    props: ({ data: { taskList = {}, loading, error } }) => {
        if (error) throw new Error(error)
        return {
            loading,
            tasks: taskList.results,
            moreTasksToLoad: taskList.hasMore
        }
    }
})

export const Other = {}
