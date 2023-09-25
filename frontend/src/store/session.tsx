import { Dispatch } from 'redux'
import { createAsyncThunk, createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';

type User = {
    credential : String,
    password: String
}

type FullUser = {
    username : string,
    password : string,
    email : string
}
interface SessionState {
    loading: boolean;
    error: null | string;
    data: null | string;
}

const initialState = {
    loading: false,
    error: null,
    data: null
} as SessionState;

export const sessionSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        endSession: (state) => {
            sessionStorage.removeItem('jwtToken');
            state.data = null;
        }
    },
    extraReducers(builder) {
        builder
        .addCase(startSession.pending, (state) => {
            state.loading = true;
        })
        .addCase(startSession.fulfilled, (state, action : PayloadAction<string>) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(startSession.rejected, (state, action : PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export const validateCurrentUser = createAsyncThunk('session/validateUser', async (token : String | null) => {
    console.log(1)
    const res = await fetch('api/users/currentUser', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({token})
    });
    const data = await res.json();
    return data;
})
export const registerUser = createAsyncThunk('session/registerUser', async (user : FullUser) => {
    const res = await fetch('api/users/register', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(user)
    });
})

export const startSession = createAsyncThunk('session/startSession', async (user : User) => {
    console.log(JSON.stringify(user))
    const res = await fetch('/api/users/login', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(user)
    });
    console.log(res)
    const token = await res.json();
    sessionStorage.setItem('jwtToken', token.accessToken);
    return token;
    // return user object
})

export default sessionSlice.reducer;