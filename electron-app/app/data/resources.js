import resourceHandler from './resource-handler'

resourceHandler.add({
    name: 'tasks',
    collectionName: 'tasks3',
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
            estimatedPoms: {
                type: 'integer',
            },
        },
    },
})
