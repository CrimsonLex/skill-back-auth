import { Request, Response, Router } from 'express';

const router = Router();

router.get("/", (req:Request, res: Response) => {
  res.send({ data: "HERE_MODELS_WILL_GO"});
});

export { router };