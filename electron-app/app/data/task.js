export default `
    input TaskInput {
        name: String
        estimatedPoms: Int
    }
    # A single tracked task.  Pomodoros will be assigned to this
    type Task {
        name: String!
        id: String
        # All tasks must have a pomodoro estimate before beginning
        estimatedPoms: Int!
    }
`
