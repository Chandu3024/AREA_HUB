import Admin from "../models/adminModel.js";

export const AddAdmin = async(req, res)=>{
    try{
        const user = Admin(req.body);
        if(!user){
            res.status(404).json({msg:"Admin data is empty"})
        }
        await user.save();
        res.status(200).json({msg:'Succesfully created Admin'});
    }catch(error){
        res.status(500).json({error : error.message})
    }
}

export const GetAdmin = async(req, res)=>{
    try{
        const data =  req.params.data;
        const arr = data.split(',');
        const email = arr[0];
        const pass = arr[1];
        const admin = await Admin.findOne({email : email});
        if(Object.keys(admin).length==0 || admin.pass!=pass){
            res.status(404).json({msg:"Admin Not Found"})
        }
        else{
            res.status(200).json(admin);
        }
    }catch(error){
        res.status(500).json({error : error.message})
    }
}