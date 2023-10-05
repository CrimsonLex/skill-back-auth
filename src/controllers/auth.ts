import { Request, Response } from "express";
import { loginUser, registerNewUser } from "../services/auth"
import { handleHttp } from "../utils/error.handle";
import { RequestExt } from "../interfaces/request-extended.interfaces";

 const registerCtrl = async({ body }:Request, res:Response) => {
    const responseUser = await registerNewUser(body);
    res.send(responseUser); 
 };

 const loginCtrl = async({ body }:Request, res:Response) => {
   const { email, password } = body; 
   const responseUser = await loginUser({ email, password });
   if (responseUser === 'PASSWORD_INCORRECT'){
      res.status(403);
      res.send(responseUser);
   }else{
      res.send(responseUser); 
   }
 };

 const checkSession = async(req:RequestExt, res:Response)=> {
   try{
      res.send({
         data: 'CORRECT_SESSION_CHECK',
         user:req.user,
      });
   }catch (e) {
      handleHttp(res, "ERROR_DURING_SESSION_CHECK"); 
   }
 };

 export { loginCtrl, registerCtrl, checkSession };