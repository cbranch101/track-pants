export const tasks = {
    name: 'tasks',
    collectionName: 'tasks4',
    schema: {
        version: 2,
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
            active: {
                type: 'boolean',
            },
            archived: {
                type: 'boolean',
            },
        },
    },
    migrationStrategies: {
        1: (doc) => {
            return {
                ...doc,
                active: false,
            }
        },
        2: (doc) => {
            return {
                ...doc,
                archived: false,
            }
        },

    },
}

export const pomodoros = {
    name: 'pomodoros',
    collectionName: 'pomodoro1',
    schema: {
        version: 0,
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

}
