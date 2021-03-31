import { Vote } from '../ChainbridgeContext'

export function transitMessageReducer(
    transitMessage: Array<string | Vote>,
    action:
        | { type: 'addMessage', payload: string | Vote }
        | { type: 'resetMessages' }
) {
    switch (action.type) {
        case 'addMessage':
            return [...transitMessage, action.payload]
        case 'resetMessages':
            return []
        default:
            return transitMessage
    }
}
