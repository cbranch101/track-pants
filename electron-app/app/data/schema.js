import { makeExecutableSchema } from 'graphql-tools'
import Task from './task'

const RootQuery = `
    type Query {
        # get all tasks
        taskList : [Task]
    }
`

const Mutations = `
    type Mutation {
        createTask(task: TaskInput): Task
        updateTask(id: String, task: TaskInput): Task
        removeTask(id: String): String
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
        taskList: (query, args, { tasks }) => {
            return tasks.findAll().catch(
                e => {
                    throw e
                }
            )
        }
    },
    Task: {
        id: (task) => task._id
    },
    Mutation: {
        createTask: (mutation, args, { tasks }) => {
            return tasks.insert(args.task)
        },
        removeTask: (mutation, args, { tasks }) => tasks.remove(args.id).then(
            () => args.id
        ),
        updateTask: (mutation, args, { tasks }) => {
            return tasks.update(args.id, args.task).then(
                data => {
                    return {
                        _id: args.id,
                        ...args.task,
                    }
                }
            )
        }
    },
}

export default makeExecutableSchema({
    typeDefs: [SchemaDefinition, RootQuery, Task, Mutations],
    resolvers,
})
