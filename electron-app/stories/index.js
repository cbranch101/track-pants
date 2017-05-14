import { addDecorator } from '@kadira/storybook';
import materialUIDecorator from './decorators/material-ui'

addDecorator(materialUIDecorator)

require('./task-list')
require('./timer')
