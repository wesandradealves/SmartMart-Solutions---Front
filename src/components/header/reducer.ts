type State = {
    rendered: boolean;
    isLoggingOut: boolean;
};

type Action =
    | { type: 'SET_RENDERED' }
    | { type: 'START_LOGOUT' }
    | { type: 'FINISH_LOGOUT' };

export const initialState: State = {
    rendered: false,
    isLoggingOut: false,
};

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_RENDERED':
            return { ...state, rendered: true };
        case 'START_LOGOUT':
            return { ...state, isLoggingOut: true };
        case 'FINISH_LOGOUT':
            return { ...state, isLoggingOut: false };
        default:
            return state;
    }
};