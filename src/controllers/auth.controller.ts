import { Request, Response } from "express";
import { loginUser, registerNewUser } from "../services/auth.service"
import { handleHttp } from "../utils/error.handle";
import { RequestExt } from "../interfaces/request-extended.interface";
import { ResponseMessage } from "../common/constants";

const registerCtrl = async ({ body }: Request, res: Response) => {
  const responseUser = await registerNewUser(body);
  if (responseUser === ResponseMessage.ALREADY_USER) {
    return res.status(400).send(responseUser);
  }
  res.status(201).send(responseUser);
};

const loginCtrl = async ({ body }: Request, res: Response) => {
  const { email, password } = body;
  const responseUser = await loginUser({ email, password });
  if (responseUser === ResponseMessage.AUTH_FAILED) {
    return res.status(401).send(responseUser);
  }
  res.status(200).send(responseUser);

};

const checkSession = async (req: RequestExt, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).send(ResponseMessage.ERROR_DURING_SESSION_CHECK);
    }

    res.status(200).send({
      data: ResponseMessage.CORRECT_SESSION_CHECK,
      user: req.user,
    });
  } catch (e) {
    res.status(401).send(ResponseMessage.ERROR_DURING_SESSION_CHECK);
    handleHttp(res, ResponseMessage.ERROR_DURING_SESSION_CHECK);
  }
};
export { loginCtrl, registerCtrl, checkSession };