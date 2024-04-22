import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ActionMapType<M extends { [index: string]: any }> = {
    [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
    }
    : {
        type: Key;
        payload: M[Key];
    };
};

enum Types {
    INITIAL = 'INITIAL',
    LOGIN = 'LOGIN',
    REGISTER = 'REGISTER',
    LOGOUT = 'LOGOUT',
}

export type AuthUserType = null | Record<string, any>;

type Payload = {
    [Types.INITIAL]: {
        user: AuthUserType;
    };
    [Types.LOGIN]: {
        user: AuthUserType;
    };
    [Types.REGISTER]: {
        user: AuthUserType;
    };
    [Types.LOGOUT]: undefined;
};

// type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

export type AuthStateType = {
    status?: string;
    loading?: boolean;
    user?: AuthUserType;
};

const initialState: AuthStateType = {
    user: null,
    loading: true,
}

export const counterSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        initial(state, action: PayloadAction<Payload[typeof Types.INITIAL]>) {
            state.loading = false;
            state.user = action.payload.user;
        },
        login(state, action: PayloadAction<Payload[typeof Types.LOGIN]>) {
            state.user = action.payload.user;
        },
        register(state, action: PayloadAction<Payload[typeof Types.REGISTER]>) {
            state.user = action.payload.user;
        },
        logout(state) {
            state.user = null;
        },
    }
})

export const { initial, login, register, logout } = counterSlice.actions;

export default counterSlice.reducer;