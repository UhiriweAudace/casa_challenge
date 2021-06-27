import jwt from "jsonwebtoken";
import {AppConfig} from "../config/index.js";

 function isAuth(req, res, next) {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).send({
      status: 401,
      message: 'Access Denied. No token provided!',
    });
  }

  try {
    const decodedToken = jwt.verify(token, AppConfig.tokenSecretOrKey);
    req.user = decodedToken;
    return next();
  } catch (error) {
    return res.status(400).send({  status: 400,  message: 'You provided the invalid token!',});
  }
}

export default isAuth;