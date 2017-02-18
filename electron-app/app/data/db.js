import * as RxDB from 'rxdb'
import * as adapter from 'pouchdb-adapter-websql'
import resourceHandler from './resource-handler'
import './resources'

export default async () => {
    if (process.env.NODE_ENV === 'graphiql') {
        global.openDatabase = require('websql')
    }
    RxDB.plugin(adapter)
    const db = await RxDB.create('trackPantsDB', 'websql')
    return await resourceHandler.init(db)
}
