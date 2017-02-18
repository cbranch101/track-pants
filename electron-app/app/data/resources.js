import resourceHandler from './resource-handler'

resourceHandler.add({
    name: 'tasks',
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
