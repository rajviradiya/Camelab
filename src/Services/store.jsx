import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./Slice/AuthSlice ";

const store = configureStore({
    reducer: {
        counter: authReducer,
    },
})

export default store