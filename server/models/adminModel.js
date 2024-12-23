import mongoose from "mongoose";

const admin = mongoose.Schema({
    adminName:{
        type:String,
        requird:true
    },
    adminId:{
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
    }
});

export default mongoose.model('Admin', admin);