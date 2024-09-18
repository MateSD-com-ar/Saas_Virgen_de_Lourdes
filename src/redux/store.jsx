import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartSlice from "./slices/cartSlice";


const store = configureStore({
    reducer:{
        cart:cartSlice,
        auth:authReducer,
    }
})


export default store