import { storiesOf, action } from '@kadira/storybook'
import React from 'react'
import moment from 'moment'

import TimeSummary from '../app/components/time-summary'

const getDate = (dateString) => moment(dateString).valueOf() / 1000

storiesOf('TimeSummary', module).add('Basic Configuration', () => {
    const tasks = [
        {
            id: '1',
            name: 'A task name',
            estimatedPoms: 1,
            completed: true,
            poms: {
                byType: {
                    completed: [
                        {
                            createdAt: getDate('1983-05-15 01:00'),
                            duration: 1500
                        },
                        {
                            createdAt: getDate('1983-05-15 02:00'),
                            duration: 1500
                        },
                        {
                            createdAt: getDate('1983-05-20 05:30'),
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
            name: 'Another task name',
            estimatedPoms: 5,
            completed: true,
            poms: {
                byType: {
                    completed: [
                        {
                            createdAt: getDate('1983-05-14 01:00'),
                            duration: 1500
                        },
                        {
                            createdAt: getDate('1983-05-15 02:00'),
                            duration: 1500
                        },
                        {
                            createdAt: getDate('1983-05-16 05:30'),
                            duration: 1500
                        }
                    ]
                },
                completedCount: 3,
                interruptedCount: 1
            }
        },
        {
            id: '3',
            name: 'An empty task',
            estimatedPoms: 5,
            completed: false,
            poms: {
                byType: {
                    completed: []
                },
                completedCount: 0,
                interruptedCount: 0
            }
        }
    ]
    return <TimeSummary tasks={tasks} />
})
