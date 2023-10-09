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
        let coords = section.svg_path.split(/[,\s]/).filter((ele) => !isNaN(parseInt(ele)));
        let minX = parseInt(coords[0]), maxX = parseInt(coords[0]);
        let minY = parseInt(coords[1]), maxY = parseInt(coords[1]);
        for (let i = 0; i < coords.length; i++) {
            if (i % 2) {
                minY = Math.min(minY, parseInt(coords[i]));
                maxY = Math.max(maxY, parseInt(coords[i]));
            }
            else {
                minX = Math.min(minX, parseInt(coords[i]));
                maxX = Math.max(maxX, parseInt(coords[i]));
            }
        }
        let formattedRows = section.rows ? section.rows.map(ele => parseInt(ele)) : [];
        parsedStadiumData.push({ 
            id: section.id, 
            svg: section.svg_path, 
            rating: section.star_rating, 
            rows: formattedRows,
            textX: (minX + maxX) / 2,
            textY: (minY + maxY) / 2 
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