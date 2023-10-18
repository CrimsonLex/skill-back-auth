import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.handle";
import { JwtPayload } from "jsonwebtoken";
import { RequestExt } from "../interfaces/request-extended.interface";
import { ResponseMessage } from "../common/constants";


const checkJwt = (req:RequestExt, res:Response, next:NextFunction) => {
    try{
        const jwtByUser = req.headers.authorization || '';
        const jwt = jwtByUser.split(" ").pop() || '';
        const isUser = verifyToken(jwt);
        if(!isUser){
            return res.status(401).send(ResponseMessage.NO_VALID_JWT_SESSION);
        }
        req.user = isUser;
        console.log({ jwtByUser });
        next();
        
    }catch(e) {
        console.log({ e });
        res.status(400).send(ResponseMessage.ERROR_DURING_SESSION_CHECK)
        
    }  
};
export { checkJwt };