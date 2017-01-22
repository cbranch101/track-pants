import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import TaskList from '../app/components/task-list'

storiesOf('TaskList', module)
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
    return (<TaskList
      tasks={tasks}
      startTask={action('start task')}
      completeTask={action('complete task')}
      editTask={action('edit task')}
      deleteTask={action('delete task')}
    />)
  })
