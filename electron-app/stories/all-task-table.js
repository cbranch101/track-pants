import { storiesOf, action } from '@kadira/storybook'
import React from 'react'

import AllTasksTable from '../app/components/all-tasks-table'

storiesOf('AllTaskTable', module)
  .add('Basic Configuration', () => {
      const tasks = [
          {
              id: '1',
              name: 'Complete a whole app, like a boss',
              estimatedPoms: 3,
          },
          {
              id: '2',
              name: 'Do some serious work',
              estimatedPoms: 5,
              actualPoms: 2,
          },
      ]
      return (<AllTasksTable
          tasks={tasks}
          loading={false}
          createTask={action('create task')}
          updateTask={action('update task')}
          removeTask={action('remove task')}
      />)
  })
