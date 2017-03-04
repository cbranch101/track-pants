import resourceHandler from './resource-handler'

resourceHandler.add({
    name: 'tasks',
    collectionName: 'tasks2',
    schema: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
            },
            estimatedPoms: {
                type: 'integer',
            },
        },
    },
})
