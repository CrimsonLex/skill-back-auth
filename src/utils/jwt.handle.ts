import { sign, verify, Secret } from "jsonwebtoken";
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined.");
}

const JWT_SECRET = process.env.JWT_SECRET as Secret;

const generateToken = (id: string) => {
  const jwt = sign({ id }, JWT_SECRET, {
    expiresIn: "2h",
  });
  return jwt;
};

const verifyToken = (jwt: string ) => {
    const isOk = verify(jwt, JWT_SECRET);
    return isOk;

};

export { generateToken, verifyToken };

