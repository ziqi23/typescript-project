import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// type Section = {
//     id : string,
//     rows?: string[],
//     svg_path : string,
//     star_rating : number
// }

interface SectionState {
    data: string[]
}

const initialState = {
    data: []
} as SectionState

export const selectedSectionSlice = createSlice({
    name: "section",
    initialState,
    reducers: {
        add: (state, action: PayloadAction<string>) => {
            if (!state.data.includes(action.payload)) {
                state.data.push(action.payload)
            }
        },
        remove: (state, action: PayloadAction<string>) => {
            if (state.data.includes(action.payload)) {
                let index = state.data.indexOf(action.payload)
                state.data = state.data.slice(0, index).concat(state.data.slice(index + 1))
            }
        },
        reset: (state) => {
            state.data = [];
        }
    }
})

export const { add, remove, reset } = selectedSectionSlice.actions;

export default selectedSectionSlice.reducer