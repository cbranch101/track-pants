import plugin from 'pouchdb-adapter-memory'

import ResourceHandler from '../resource-handler'
import { createDb } from '../db'

let db = null
let collections = null

const widgetResource = {
    name: 'widget',
    collectionName: 'widget',
    schema: {
        version: 0,
        type: 'object',
        properties: {
            name: {
                type: 'string',
                index: true,
            },
        },
    },
}

beforeAll(async () => {
    db = await createDb('testdb', { name: 'memory', plugin })
    const resourceHandler = new ResourceHandler()
    resourceHandler.add(widgetResource)
    collections = await resourceHandler.init(db)
})

afterEach(() => {
    return Promise.all(Object.keys(collections).map(
        name => {
            const collection = collections[name]
            return collection.remove()
        }
    ))
})

afterAll(async () => {
    return db.destroy()
})

test('should be able to insert and find an item based on a supplied property and by id', async () => {
    await collections.widget.insert({
        name: 'Sprocket',
    })
    const otherWidget = await collections.widget.insert({
        name: 'Other',
    })
    const foundItems = await collections.widget.find({
        name: 'Sprocket',
    })
    const singleItem = await collections.widget.findById(otherWidget._id)
    expect(foundItems[0]).toMatchObject({
        name: 'Sprocket',
    })
    expect(singleItem).toMatchObject({
        name: 'Other',
    })
})

test('should be able to be able to findById', async () => {
    const widget = await collections.widget.insert({
        name: 'Sprocket',
    })
    const foundItem = await collections.widget.findById(widget._id)
    expect(foundItem).toMatchObject({
        name: 'Sprocket',
    })
})

test('should be able to update', async () => {
    const widget = await collections.widget.insert({
        name: 'Sprocket',
    })
    const foundItem = await collections.widget.update(widget._id, { name: 'Updated' })
    expect(foundItem).toMatchObject({
        name: 'Updated',
    })
})

test('should be able to remove', async () => {
    const widget = await collections.widget.insert({
        name: 'Sprocket',
    })
    await collections.widget.remove(widget._id)
    const foundItem = await collections.widget.findById(widget._id)
    expect(foundItem).toBeNull()
})
