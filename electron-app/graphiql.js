import express from 'express'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import bodyParser from 'body-parser'
import Schema from './app/data/schema'

const GRAPHQL_PORT = 9001

const graphQLServer = express()

graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress({
    schema: Schema,
    context: {},
}))

graphQLServer.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
}))

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`
))
