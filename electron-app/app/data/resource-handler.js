

const findById = (collection, id) => {
    return collection.findOne({
        _id: { $eq: id }
    }).exec()
}

const insert = (collection, item) => collection.insert(item)
const findAll = (collection) => collection.find().exec()
const update = async (collection, id, fields) => {
    const doc = await findById(collection, id)
    Object.keys(fields).forEach(
        field => doc.set(field, fields[field])
    )
    await doc.save()
    return {
        ...doc,
        ...fields,
    }
}

const remove = async (collection, id) => {
    const doc = await findById(collection, id)
    await doc.remove()
    return id
}

const defaultMethods = {
    findById,
    findAll,
    update,
    insert,
    remove,
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
