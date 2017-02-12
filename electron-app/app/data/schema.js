import { makeExecutableSchema } from 'graphql-tools'
import Widget from './widget'

const widget = {
    name: 'test',
};

export function resetData() {
    widget.name = 'foo';
}

const RootQuery = `
    type Query {
        widget : Widget
    }
`

const Mutations = `
    type Mutation {
        setWidgetName(name: String): Widget
    }
`

const SchemaDefinition = `
    schema {
        query: Query,
        mutation: Mutation,
    }
`

const resolvers = {
    Query: {
        widget: () => Promise.resolve(widget),
    },
    Mutation: {
        setWidgetName: (mutation, args) => {
            console.log(args)
            widget.name = args.name
            return Promise.resolve(widget)
        }
    },
}

export default makeExecutableSchema({
    typeDefs: [SchemaDefinition, RootQuery, Widget, Mutations],
    resolvers,
})
