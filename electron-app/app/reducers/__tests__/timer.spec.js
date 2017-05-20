import timer from '../timer'
import { startTimer, tick, stopTimer } from '../../actions/timer'

describe('Timer reducer / action', () => {
    describe('on startTimer', () => {
        it('should add a new timer indexed at timer name', () => {
            const actual = timer(undefined, startTimer('test'))
            const expected = {
                test: 0,
            }
            expect(actual).toEqual(expected)
        })
    })
    describe('on tick', () => {
        it('should set the provided time', () => {
            const state = {
                other: 1,
                test: 0,
            }
            const actual = timer(state, tick('test', 1))
            const expected = {
                other: 1,
                test: 1,
            }
            expect(actual).toEqual(expected)
        })
    })
    describe('on stop', () => {
        it('should remove the timer', () => {
            const state = {
                other: 1,
                test: 1,
            }
            const actual = timer(state, stopTimer('test'))
            const expected = {
                other: 1,
            }
            expect(actual).toEqual(expected)
        })
    })
})
