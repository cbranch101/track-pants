import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import TaskList from '../app/components/task-list'

storiesOf('TaskList', module)
  .add('Basic Configuration', () => <TaskList />)
