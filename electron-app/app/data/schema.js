import { makeExecutableSchema } from 'graphql-tools'
import _ from 'lodash'
import { timeStampToDateString } from '../utils/time'

import Task from './task'
import Pom from './pom'

const RootQuery = `
    type Query {
        # get all tasks
        taskList(first: Int, after: String): TaskList
        task(id: String): Task
        untrackedTimeByDay: [UntrackedDay]
        untrackedTimeForDay(dateString: String): UntrackedDay
    }
    type TaskList {
        results: [Task]
        hasMore: Boolean!
    }
    type UntrackedDay {
        dateString: String
        minutes: Int
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
const indexPoms = poms => {
    return poms.reduce(
        (memo, pom) => {
            if (!pom.interrupted) {
                return {
                    ...memo,
                    completed: [...memo.completed, pom]
                }
            }
            return {
                ...memo,
                interrupted: [...memo.interrupted, pom]
            }
        },
        { completed: [], interrupted: [] }
    )
}

const getUntrackedByDay = poms => {}

const resolvers = {
    Query: {
        taskList: (query, args, { tasks }) => {
            const search = {}
            const sort = { createdAt: 1 }
            return tasks
                .find(search, sort)
                .catch(e => {
                    throw e
                })
                .then(foundTasks => {
                    const startIndex = args.after
                        ? _.findIndex(foundTasks, task => task._id === args.after) + 1
                        : 0

                    const toTake = args.first || foundTasks.length
                    const droppedTasks = _.drop(foundTasks, startIndex)
                    const hasMore = toTake < droppedTasks.length
                    return {
                        results: _.take(droppedTasks, toTake),
                        hasMore
                    }
                })
        },
        untrackedTimeByDay: (query, args, { pomodoros }) => {
            return pomodoros.find({ taskID: 'untracked' }, { createdAt: 1 }).then(poms => {
                const untrackedByDay = poms.reduce((memo, pom) => {
                    const dateString = timeStampToDateString(pom.createdAt)
                    if (!memo[dateString]) {
                        memo[dateString] = 0
                    }
                    memo[dateString] += pom.duration / 60
                    return memo
                }, {})
                return Object.keys(untrackedByDay).map(dateString => ({
                    dateString,
                    minutes: Math.round(untrackedByDay[dateString])
                }))
            })
        },
        task: (query, args, { tasks }) => {
            return tasks.findById(args.id)
        }
    },
    Pom: {
        id: pom => pom._id
    },
    Task: {
        id: task => task._id,
        poms: (task, args, { pomodoros }) => {
            const search = { taskID: task._id }
            const sort = { createdAt: 1 }
            return pomodoros.find(search, sort).then(indexPoms).then(pomsByType => {
                const interruptedCount = pomsByType.interrupted.length
                const completedCount = pomsByType.completed.length
                return {
                    byType: pomsByType,
                    interruptedCount,
                    completedCount,
                    anyRecorded: interruptedCount > 0 || completedCount > 0
                }
            })
        }
    },
    Mutation: {
        createTask: (mutation, args, { tasks }) => {
            return tasks.insert(args.task).then(task => ({
                ...task,
                poms: {
                    byType: {
                        completed: [],
                        interrupted: []
                    },
                    completedCount: 0,
                    interruptedCount: 0,
                    anyRecorded: false
                },
                archived: false,
                active: false,
                completed: false
            }))
        },
        createPom: (mutation, args, { pomodoros }) => {
            return pomodoros.insert(args.pom)
        },
        removeTask: (mutation, args, { tasks }) => tasks.remove(args.id).then(() => args.id),
        updateTask: (mutation, args, { tasks }) => {
            return tasks.update(args.id, args.task).then(data => {
                return {
                    _id: args.id,
                    ...data
                }
            })
        }
    }
}

export default makeExecutableSchema({
    typeDefs: [SchemaDefinition, RootQuery, Task, Mutations, Pom],
    resolvers
})
