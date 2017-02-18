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
        createWidget(id: String, name: String): Widget
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
        widget: (query, args, { tasks }) => {
            return tasks.findByID(args.id)
        }
    },
    Mutation: {
        createWidget: (mutation, args, db) => {
            return db.tasks.insert(args)
        },
        setWidgetName: (mutation, args, context) => {
            widget.name = args.name
            return Promise.resolve(widget)
        }
    },
}

export default makeExecutableSchema({
    typeDefs: [SchemaDefinition, RootQuery, Widget, Mutations],
    resolvers,
})
