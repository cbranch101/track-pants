import resourceHandler from './resource-handler'

resourceHandler.add({
    name: 'tasks',
    schema: {
        title: 'A single tracked task',
        type: 'object',
        properties: {
            id: {
                type: 'string',
                primary: true,
            },
            name: {
                type: 'string',
            },
        },
    },
})
