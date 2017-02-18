import express from 'express'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import bodyParser from 'body-parser'
import Schema from './app/data/schema'
import { buildGetContext } from './app/apollo-client'

const GRAPHQL_PORT = 9001

const getContext = buildGetContext()

const graphQLServer = express()

graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress(() => {
    return getContext().then(
        context => ({
            schema: Schema,
            context,
            formatError: (err) => { console.log(err.stack); return err }
        }))
}))

graphQLServer.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
}))

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`
))
