

const findById = (collection, id) => {
    return collection.findOne(id).exec()
}

const insert = (collection, item) => collection.insert(item)
const find = (collection, query = {}, sort) => {
    const findQuery = collection.find(query)
    const queryWithSort = sort ? findQuery.sort(sort) : findQuery
    return queryWithSort.exec()
}
const findAll = (collection) => collection.find().exec()
const update = async (collection, id, fields) => {
    const doc = await findById(collection, id)
    Object.keys(fields).forEach(
        field => doc.set(field, fields[field])
    )
    await doc.save()
    const returnValue = {
        ...doc,
        ...fields,
    }
    return returnValue
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
    find,
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
                    return db.collection(resourceOption.collectionName, resourceOption.schema).then(
                        collection => {
                            const suppliedMethods = resourceOptions.methods ?
                                resourceOptions.methods(defaultMethods) :
                                {}

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
