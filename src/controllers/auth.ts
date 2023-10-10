import { Request, Response } from "express";
import { loginUser, registerNewUser } from "../services/auth"
import { handleHttp } from "../utils/error.handle";
import { RequestExt } from "../interfaces/request-extended.interfaces";

 const registerCtrl = async({ body }:Request, res:Response) => {
    const responseUser = await registerNewUser(body);
    if(responseUser === 'ALREADY_USER'){
      res.status(400);
      res.send(responseUser)
    }else{
      res.status(201)
      res.send(responseUser); 
    }
 };

 const loginCtrl = async({ body }:Request, res:Response) => {
   const { email, password } = body; 
   const responseUser = await loginUser({ email, password });
   if (responseUser !== 'AUTH_FAILED'){
      res.status(200); 
      res.send(responseUser);
   }else{
      res.status(401);
      res.send(responseUser);
   }
 };

 const checkSession = async(req:RequestExt, res:Response)=> {
   try{
      if (!req.user) {
         res.status(401);
         res.send("ERROR_DURING_SESSION_CHECK");
         return;
       }
   
       res.status(200);
       res.send({
         data: "CORRECT_SESSION_CHECK",
         user: req.user,
       });
      
   }catch (e) {
      res.status(401);
      handleHttp(res, "ERROR_DURING_SESSION_CHECK"); 
   }
 };

 export { loginCtrl, registerCtrl, checkSession };