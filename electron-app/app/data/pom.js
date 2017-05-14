export default `
    input PomInput {
        createdAt: Int
        interrupted: Boolean
        duration: Int
        taskID: String
    }

    type Pom {
        id: String
        createdAt: Int
        interrupted: Boolean
        duration: Int
        taskID: String
    }
`
