const WidgetType = `
    type Widget {
        name: String
    }
    type Mutation {
        setWidgetName(name: String): Widget
    }
`

export default WidgetType
