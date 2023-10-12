import { Auth } from "../interfaces/auth.interface";
import { User } from "../interfaces/user.interface";
import UserModel from "../models/user";
import { encrypt, verified } from "../utils/bcrypt.handle";
import { generateToken } from "../utils/jwt.handle";

 const registerNewUser = async({ email, password, name }:User) => {
    const checkIs = await UserModel.findOne({ email });
    if(checkIs) return "ALREADY_USER";
    const passHash = await encrypt(password);
    const registerNewUser = await UserModel.create({ email, password:passHash, name });
    return registerNewUser;
 };

 const loginUser = async( { email, password }: Auth) => {
   const checkIs = await UserModel.findOne({ email });
   if(!checkIs) return "AUTH_FAILED";

   const passwordHash = checkIs.password;
   const isCorrect = await verified(password, passwordHash);

   if(!isCorrect) return "AUTH_FAILED";

   const token = generateToken(checkIs._id.toString());
   
   const data = {
    token,
    user: checkIs,
   };
   return data;

 };

 export{ loginUser, registerNewUser};