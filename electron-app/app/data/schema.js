import { makeExecutableSchema } from 'graphql-tools'
import Task from './task'
import Pom from './pom'

const RootQuery = `
    type Query {
        # get all tasks
        taskList : [Task]
        task(id: String): Task
    }
`

const Mutations = `
    type Mutation {
        createTask(task: TaskInput): Task
        updateTask(id: String, task: TaskInput): Task
        removeTask(id: String): String
        createPom(pom: PomInput): Pom
    }
`

const SchemaDefinition = `
    schema {
        query: Query,
        mutation: Mutation,
    }
`

const indexPoms = (poms) => {
    return poms.reduce(
        (memo, pom) => {
            if (!pom.interrupted) {
                return {
                    ...memo,
                    completed: [
                        ...memo.completed,
                        pom,
                    ]
                }
            }
            return {
                ...memo,
                interrupted: [
                    ...memo.interrupted,
                    pom,
                ]
            }
        },
        { completed: [], interrupted: [] },
    )
}

const resolvers = {
    Query: {
        taskList: (query, args, { tasks }) => {
            const search = {}
            const sort = { createdAt: 1 }
            return tasks.find(search, sort).catch(
                e => {
                    throw e
                }
            )
        },
        task: (query, args, { tasks }) => {
            return tasks.findById(args.id)
        },
    },
    Pom: {
        id: (pom) => pom._id,
    },
    Task: {
        id: (task) => task._id,
        poms: (task, args, { pomodoros }) => {
            const search = { taskID: task._id }
            const sort = { createdAt: 1 }
            return pomodoros.find(search, sort).then(indexPoms).then(pomsByType => {
                console.log(pomsByType)
                const interruptedCount = pomsByType.interrupted.length
                const completedCount = pomsByType.completed.length
                return {
                    byType: pomsByType,
                    interruptedCount,
                    completedCount,
                    anyRecorded: interruptedCount > 0 || completedCount > 0,
                }
            })
        },
    },
    Mutation: {
        createTask: (mutation, args, { tasks }) => {
            return tasks.insert(args.task)
        },
        createPom: (mutation, args, { pomodoros }) => {
            return pomodoros.insert(args.pom)
        },
        removeTask: (mutation, args, { tasks }) => tasks.remove(args.id).then(
            () => args.id
        ),
        updateTask: (mutation, args, { tasks }) => {
            return tasks.update(args.id, args.task).then(
                data => {
                    return {
                        _id: args.id,
                        ...data,
                    }
                }
            )
        }
    },
}

export default makeExecutableSchema({
    typeDefs: [SchemaDefinition, RootQuery, Task, Mutations, Pom],
    resolvers,
})
