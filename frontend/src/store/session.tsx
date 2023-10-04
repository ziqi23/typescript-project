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
    error: string | null;
    data: string | null;
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
            localStorage.removeItem('jwtToken');
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
        .addCase(validateCurrentUser.fulfilled, (state, action : PayloadAction<string>) => {
            state.loading = false;
            state.data = action.payload;
        })
    }
})

export const validateCurrentUser = createAsyncThunk('session/validateUser', async (token : String | null) => {
    console.log(token)
    const res = await fetch('api/users/currentUser', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({token})
    });
    if (!res.ok) {
        throw new Error("Not logged in");
    }
    else {
        const { user } = await res.json();
        return user.user.id;
    }
})

export const registerUser = createAsyncThunk('session/registerUser', async (user : FullUser) => {
    const res = await fetch('api/users/register', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(user)
    })
    if (!res.ok) {
        const text = await res.text()
        throw new Error(text);
    }
})

export const startSession = createAsyncThunk('session/startSession', async (user : User) => {
    const res = await fetch('/api/users/login', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(user)
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
    }
    else {
        const {user, token} = await res.json();
        localStorage.setItem('jwtToken', token);
        return user;
    }
})

export const { endSession } = sessionSlice.actions;
export default sessionSlice.reducer;