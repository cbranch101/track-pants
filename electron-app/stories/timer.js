import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import TimerCard from '../app/components/timer/card'

const task = {
    name: 'Set up basic structure',
    estimatedPoms: 1,
    poms: {
        completed: [
            {
                id: 1,
            },
            {
                id: 2,
            },
        ],
        interrupted: [],
    },
}

const onStartPom = action('starting pom')
const onStopPom = action('stopping pom')
const onStartBreak = action('starting break')
const onStopBreak = action('stopping break')

storiesOf('Timer', module)
  .add('Waiting to start Pom', () => {
      const timerStep = 'waitingToStartPom'
      const props = {
          task,
          timerStep,
          onStartPom,
          onStopPom,
          timer: {},
      }
      return (<TimerCard {...props} />)
  })
  .add('In Pom', () => {
      const timerStep = 'inPom'
      const props = {
          task,
          timerStep,
          onStartPom,
          onStopPom,
          timer: {
              pomodoro: 5,
          },
      }
      return (<TimerCard {...props} />)
  })
  .add('Waiting To Start Break', () => {
      const timerStep = 'waitingToStartBreak'
      const props = {
          task,
          timerStep,
          onStartPom,
          onStopPom,
          onStartBreak,
          timer: {
              pomodoro: 5,
          },
      }
      return (<TimerCard {...props} />)
  })
  .add('In Break', () => {
      const timerStep = 'inBreak'
      const props = {
          task,
          timerStep,
          onStartPom,
          onStopPom,
          onStartBreak,
          onStopBreak,
          timer: {
              currentBreak: 2,
          },
      }
      return (<TimerCard {...props} />)
  })
