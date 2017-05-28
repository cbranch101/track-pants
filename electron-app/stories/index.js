import { addDecorator } from '@kadira/storybook'
import materialUIDecorator from './decorators/material-ui'

addDecorator(materialUIDecorator)

require('./timer')
require('./active-tasks-table')
require('./all-task-table')
require('./time-summary')
