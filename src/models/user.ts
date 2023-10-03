import { Schema, model } from "mongoose";
import { User } from "../interfaces/user.interface";

const UserSchema = new Schema<User>( 
    {
        name:{
            required:true,
            type:String,
        },
        password:{
            required:true,
            type:String,
        },
        email:{
            type:String,
            required:true,
            unique:true,

        },

    },
    {
        versionKey:false,
        timestamps: true,
    }
    
);

const UserModel= model("users",UserSchema);
export default UserModel;