export default `
    input TaskInput {
        name: String
        estimatedPoms: Int
        createdAt: Int
        completed: Boolean
        active: Boolean
        archived: Boolean
    }
    # A single tracked task.  Pomodoros will be assigned to this
    type PomResults {
        byType: PomsByType
        completedCount: Int!
        interruptedCount: Int!
        anyRecorded: Boolean!
    }
    type PomsByType {
        completed: [Pom]
        interrupted: [Pom]
    }
    type Task {
        name: String!
        createdAt: Int!
        id: String
        # All tasks must have a pomodoro estimate before beginning
        estimatedPoms: Int!
        poms: PomResults
        completed: Boolean
        active: Boolean!
        archived: Boolean
    }
`
