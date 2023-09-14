import { Dispatch } from 'redux'
import { createAsyncThunk, createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';

type Ticket = {
    id: string, // identifier
    eid: string, // event identifier
    sid: string, // section
    r: string, // row
    p: number, // price
    q: number, // quantity
    n: string, // note
}

// SeatGeek
// s : section string
// r : row string
// dp: price including fees number
// q : quantity number
// lvc : limited view note string


type ParsedTicket = {
    id: string,
    eventId: string,
    section: string,
    row: string,
    price: number,
    quantity: number,
    description: string
}

interface TicketState {
    loading: boolean;
    error: null | string;
    data: null | ParsedTicket[];
}

const initialState = {
    loading: false,
    error: null,
    data: null
} as TicketState;

export const ticketSlice = createSlice({
    name: "ticket",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase(getTicket.pending, (state) => {
            state.loading = true;
        })
        .addCase(getTicket.fulfilled, (state, action : PayloadAction<ParsedTicket[]>) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(getTicket.rejected, (state, action : PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

// export const showTicket = (eventUrl : string) => async (dispatch : Dispatch) => {
//     const res = await fetch('https://api.tickpick.com/1.0/listings/internal/event/5670699?trackView=true&lid=5670699');
//     const data = await res.json();
//     console.log(data)
//     dispatch(getTicket(data));
// }

export const getTicket = createAsyncThunk('ticket/getTicket', async (eventUrl : string) => {
    const res = await fetch(eventUrl, {
        method: "GET",
        headers: {
            "User-Agent": "PostmanRuntime/7.33.0",
            "Access-Control-Allow-Origin": "*"
        }
    });
    const data = await res.json();
    console.log(data)
    // parse data here. tickets need data such as price, quantity, location and special features / notices
    let formattedTicket : ParsedTicket[] = [];
    data.forEach((ticket : Ticket) => {
        if (ticket.n.search(/parking only/i) === -1) {
            formattedTicket.push({ id: ticket.id, eventId: ticket.eid, section: ticket.sid, row: ticket.r, price: ticket.p, quantity: ticket.q, description: ticket.n })
        }
    })
    return formattedTicket;
})

export default ticketSlice.reducer

// // Define types of actions handled by reducer
// enum ActionType {
//     getTicket = "GETTICKET"
// }

// // Define the action type
// type Action = {
//     type: string,
//     payload?: object
// }

// // Action creater returns an object with a type and a payload
// const getTicket = (event : object) => (
//     {
//         "type": ActionType.getTicket,
//         event
//     }
// )

// // Thunk action creater
// export const showTicket = (eventUrl : string) => async (dispatch : Dispatch) => {
//     const res = await fetch('https://api.tickpick.com/1.0/listings/internal/event/5670699?trackView=true&lid=5670699');
//     const data = await res.json();
//     // parse data here. tickets need data such as price, quantity, location and special features / notices
//     console.log(data)
//     dispatch(getTicket(data));
// }

// const initialState = {};

// const ticketReducer = (state=initialState, action : Action) => {
//     switch (action.type) {
//         case ActionType.getTicket:
//             return {...action.payload};
//         default:
//             return state;
//     }
// }

// export default ticketReducer;