import { createAsyncThunk, createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
    error: null,
    data: null
};

export const eventSlice = createSlice({
    name: "event",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase(getEvents.pending, (state) => {
            state.loading = true;
        })
        .addCase(getEvents.fulfilled, (state, action : PayloadAction<any>) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(getEvents.rejected, (state, action : PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})


export const getEvents = createAsyncThunk('event/getEvents', async () => {
    const res = await fetch("/api/events");
    const data = await res.json();

    return data.events;
})

export default eventSlice.reducer