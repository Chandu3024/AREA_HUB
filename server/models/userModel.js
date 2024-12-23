import mongoose from "mongoose";

const user = mongoose.Schema({
    userName:{
        type:String,
        requird:true
    },
    userId:{
        type:String,
        requird:true,
        unique:true
    },
    email:{
        type:String,
        unique:true,
        requird:true
    },
    pass:{
        type:String,
        requird:true
    },
    // area:{
    //     type:String
    // },
    // city:{
    //     type:String
    // },
    // coutry:{
    //     type:String
    // },
    // interests:{
    //     type:[String]
    // },
    // histry:{
    //     type:[String]
    // },
    // fev:{
    //     type:[String]
    // }
});

export default mongoose.model('User', user);