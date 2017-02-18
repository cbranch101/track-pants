import ApolloClient from 'apollo-client'
import { execute } from 'graphql'
import db from './data/db'
import schema from './data/schema'

export const buildGetContext = () => {
    let context
    return () => {
        if (context) return Promise.resolve(context)
        return db().then(createdDb => {
            context = createdDb
            return context
        })
    }
}

const getContext = buildGetContext()

const client = new ApolloClient({
    networkInterface: {
        query: ({ query, variables, operationName }) => {
            return getContext().then(
                    context => {
                        return execute(schema, query, null, context, variables, operationName)
                    }
                ).catch(
                    e => {
                        throw e
                    }
                )
        }
    }
})


export default client
