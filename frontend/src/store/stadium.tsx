import { createAsyncThunk, createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';

type Section = {
    id : string,
    rows?: string[],
    svg_path : string,
    star_rating : number,
    minX : number,
    maxX : number,
    minY : number,
    maxY : number
}

type ParsedSection = {
    id : string,
    rows? : number[],
    svg: string,
    rating: number,
    textX: number,
    textY: number 
}

interface StadiumState {
    loading: boolean;
    error: null | string;
    data: null | ParsedSection[];
}

const initialState = {
    loading: false,
    error: null,
    data: null
} as StadiumState;

export const stadiumSlice = createSlice({
    name: "stadium",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase(getStadium.pending, (state) => {
            state.loading = true;
        })
        .addCase(getStadium.fulfilled, (state, action : PayloadAction<ParsedSection[]>) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(getStadium.rejected, (state, action : PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export const getStadium = createAsyncThunk('stadium/fetchStadium', async (venueUrl : string) => {
    const res = await fetch(venueUrl);
    const data = await res.json();
    let parsedStadiumData : ParsedSection[] = [];
    // also need row x thru y;
    // personal twist to data: 1) split into halves 
    data.sections.forEach((section : Section) => {
        let formattedRows = section.rows ? section.rows.map(ele => parseInt(ele)) : [];
        parsedStadiumData.push({ 
            id: section.id, 
            svg: section.svg_path, 
            rating: section.star_rating, 
            rows: formattedRows,
            textX: (section.minX + section.maxX) / 2,
            textY: (section.minY + section.maxY) / 2 
        })
    })
    return parsedStadiumData;
})

export default stadiumSlice.reducer
// // Define types of actions handled by reducer
// enum ActionType {
//     getEvent = "GETSTADIUM"
// }

// // Define the action type
// type Action = {
//     type: string,
//     payload?: object
// }

// const getStadium = (data : ParsedSection[]) : Action => (
//     {
//         "type": ActionType.getEvent,
//         "payload": data
//     }
// )



// const initialState = {};

// const stadiumReducer = (state=initialState, action : Action) => {
//     switch (action.type) {
//         case ActionType.getEvent:
//             return action.payload;
//         default:
//             return {};
//     }
// }

// export default stadiumReducer;