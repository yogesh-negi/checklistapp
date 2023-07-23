import { configureStore } from "@reduxjs/toolkit"; 
import { createSlice } from "@reduxjs/toolkit";
import { isCompositeComponent } from "react-dom/test-utils";

let initialState = {
    user:"",
    password:"",
    validated:false,
    alreadysubmitted:[],
    listupdatestatus:false
}


let dispachers = createSlice({
    name:"login",
    initialState,
    reducers:{
    authentication:(state,action)=>{
            state.user = action.payload.user.toUpperCase()
            state.password = action.payload.password
            state.validated = true
    },
    listupdatestatus:(state,action)=>{
        state.listupdated = action.payload
    },
    alreadysubmitted:(state,action)=>{
        let array = action.payload.filter(obj => {
            return obj[Object.keys(obj)].find(object => object.status == "" && object.timestamp !== "undefined")
        })
            console.log(array)
    }
    }
})



export const {authentication,listupdatestatus,alreadysubmitted} = dispachers.actions

export const store = configureStore({
    reducer:dispachers.reducer
})