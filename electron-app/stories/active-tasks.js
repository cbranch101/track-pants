import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import ActiveTasks from '../app/components/active-tasks'

storiesOf('ActiveTasks', module)
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
      return (<ActiveTasks />)
  })
