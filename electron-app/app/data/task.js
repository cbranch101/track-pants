export default `
    input TaskInput {
        name: String
        estimatedPoms: Int
        createdAt: Int
        completed: Boolean
    }
    # A single tracked task.  Pomodoros will be assigned to this
    type PomIndex {
        completed: [Pom]
        interrupted: [Pom]
    }
    type Task {
        name: String!
        createdAt: Int!
        id: String
        # All tasks must have a pomodoro estimate before beginning
        estimatedPoms: Int!
        poms: PomIndex
        completed: Boolean
    }
`
