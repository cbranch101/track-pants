import * as RxDB from 'rxdb'
import websqlAdapter from 'pouchdb-adapter-websql'

import ResourceHandler from './resource-handler'
import * as resources from './resources'


export const createDb = (name, adapter) => {
    if (process.env.NODE_ENV === 'graphiql') {
        global.openDatabase = require('websql')
    }
    RxDB.PouchDB.plugin(adapter.plugin)
    return RxDB.create({
        name,
        adapter: adapter.name,
    })
}

const addAllResources = (resourceHandler) => {
    Object.keys(resources).map(
        name => resourceHandler.add(resources[name])
    )
}

export default async () => {
    const db = await createDb('trackpacks', { name: 'websql', plugin: websqlAdapter })
    const resourceHandler = ResourceHandler()
    addAllResources(resourceHandler)
    return await resourceHandler.init(db)
}
