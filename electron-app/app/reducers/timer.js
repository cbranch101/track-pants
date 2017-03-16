export const START_TIMER = 'START_TIMER'
export const ADVANCE_TIMER = 'ADVANCE_TIMER'
export const STOP_TIMER = 'STOP_TIMER'

export default (state = {}, action) => {
    const { type, payload } = action
    switch (type) {
    case START_TIMER: {
        return {
            ...state,
            [payload.name]: 0,
        }
    }

    case ADVANCE_TIMER: {
        return {
            ...state,
            [payload.name]: payload.value,
        }
    }

    case STOP_TIMER: {
        const {
            [payload.name]: removed, // eslint-disable-line no-unused-vars
            ...cleanedState
        } = state
        return cleanedState
    }

    default:
        return state
    }
}
