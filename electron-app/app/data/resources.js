import resourceHandler from './resource-handler'

resourceHandler.add({
    name: 'tasks',
    collectionName: 'tasks4',
    schema: {
        type: 'object',
        properties: {
            createdAt: {
                type: 'integer',
                index: true,
            },
            name: {
                type: 'string',
                index: true,
            },
            completed: {
                type: 'boolean',
            },
            estimatedPoms: {
                type: 'integer',
            },
        },
    },
})

resourceHandler.add({
    name: 'pomodoros',
    collectionName: 'pomodoro1',
    schema: {
        type: 'object',
        properties: {
            taskID: {
                type: 'string',
                index: true,
            },
            createdAt: {
                type: 'integer',
                index: true,
            },
            interrupted: {
                type: 'boolean',
            },
            duration: {
                type: 'integer',
            },
        },
    },
})
