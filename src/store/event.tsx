import { Dispatch } from 'redux'

// Define types of actions handled by reducer
enum ActionType {
    getEvent = "GETEVENT"
}

// Define the action type
type Action = {
    type: string,
    payload?: object
}

// Action creater returns an object with a type and a payload
const getEvent = (event : object) => (
    {
        "type": ActionType.getEvent,
        event
    }
)

// Thunk action creater
export const showEvent = (eventUrl : string) => async (dispatch : Dispatch) => {
    const res = await fetch('https://api.tickpick.com/1.0/listings/internal/event/5670699?trackView=true&lid=5670699');
    const data = await res.json();
    // parse data here
    console.log(data)
    dispatch(getEvent(data));
}

const initialState = {};

const eventReducer = (state=initialState, action : Action) => {
    switch (action.type) {
        case ActionType.getEvent:
            return {...action.payload};
        default:
            return state;
    }
}

export default eventReducer;