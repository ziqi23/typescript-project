import { Dispatch } from 'redux'

// Define types of actions handled by reducer
enum ActionType {
    getTicket = "GETTICKET"
}

// Define the action type
type Action = {
    type: string,
    payload?: object
}

// Action creater returns an object with a type and a payload
const getTicket = (event : object) => (
    {
        "type": ActionType.getTicket,
        event
    }
)

// Thunk action creater
export const showTicket = (eventUrl : string) => async (dispatch : Dispatch) => {
    const res = await fetch('https://api.tickpick.com/1.0/listings/internal/event/5670699?trackView=true&lid=5670699');
    const data = await res.json();
    // parse data here. tickets need data such as price, quantity, location and special features / notices
    console.log(data)
    dispatch(getTicket(data));
}

const initialState = {};

const ticketReducer = (state=initialState, action : Action) => {
    switch (action.type) {
        case ActionType.getTicket:
            return {...action.payload};
        default:
            return state;
    }
}

export default ticketReducer;