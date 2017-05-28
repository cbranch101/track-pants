import { storiesOf, action } from '@kadira/storybook'
import React from 'react'
import moment from 'moment'

import TimeSummary from '../app/components/time-summary'



console.log(moment(moment('1983-05-15 2:30').valueOf()).format('HH:mm'))

storiesOf('TimeSummary', module).add('Basic Configuration', () => {
    const days = [
        {
            value: moment('1983-05-15'),
            tasks: [
                {
                    id: '1',
                    name: 'A task name',
                    estimatedPoms: 5,
                    completed: true,
                    poms: {
                        byType: {
                            completed: [
                                {
                                    createdAt: moment('1983-05-15 1:00').valueOf(),
                                    duration: 1500
                                },
                                {
                                    createdAt: moment('1983-05-15 2:00').valueOf(),
                                    duration: 1500
                                },
                                {
                                    createdAt: moment('1983-05-20 05:30').valueOf(),
                                    duration: 1500
                                }
                            ]
                        },
                        completedCount: 3,
                        interruptedCount: 1
                    }
                },
                {
                    id: '2',
                    name: 'Another Task Name',
                    estimatedPoms: 3,
                    completed: false,
                    poms: {
                        byType: {
                            completed: [
                                {
                                    createdAt: new Date('05/15/1983').getTime(),
                                    duration: 500
                                },
                                {
                                    createdAt: new Date('05/15/1983').getTime(),
                                    duration: 500
                                }
                            ]
                        },
                        completedCount: 2,
                        interruptedCount: 1
                    }
                }

            ]
        }
    ]

    return <TimeSummary days={days} />
})
