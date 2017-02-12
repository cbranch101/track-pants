import ApolloClient from 'apollo-client'
import { execute } from 'graphql'

import schema from './data/schema'

const client = new ApolloClient({
    networkInterface: {
        query: ({ query, variables, operationName }) => {
            try {
                console.log(query)
                return execute(schema, query, null, null, variables, operationName)
                  .catch(e => {
                      throw e
                  })
            } catch (e) {
                throw e
            }
        }
    }
})

export default client
