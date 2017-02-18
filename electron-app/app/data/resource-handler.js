
const defaultMethods = {
    findByID: (collection, id) => {
        return collection.find().where('id').eq(id).exec()
            .then(
                data => {
                    return data[0]
                }
            )
    },
    insert: (collection, item) => {
        return collection.insert(item)
    }
}

const ResourceHandler = () => {
    const resourceOptions = {}
    return {
        add: (options) => {
            resourceOptions[options.name] = options
        },
        init: (db) => {
            const promises = Object.keys(resourceOptions).map(
                (resourceName) => {
                    const resourceOption = resourceOptions[resourceName]
                    return db.collection(resourceName, resourceOption.schema).then(
                        collection => {
                            const suppliedMethods = resourceOptions.methods || {}
                            const combinedMethods = {
                                ...suppliedMethods,
                                ...defaultMethods,
                            }
                            const resource = Object.keys(combinedMethods).reduce(
                                (memo, methodName) => {
                                    const method = combinedMethods[methodName]
                                    memo[methodName] = (...args) => method(collection, ...args)
                                    return memo
                                },
                                {},
                            )
                            return {
                                name: resourceName,
                                resource,
                            }
                        }
                    )
                }
            )
            return Promise.all(promises).then(
                resources => resources.reduce(
                    (memo, resource) => {
                        memo[resource.name] = resource.resource
                        return memo
                    },
                    {},
                )
            )
        }
    }
}

const resourceHandler = ResourceHandler()

export default resourceHandler
