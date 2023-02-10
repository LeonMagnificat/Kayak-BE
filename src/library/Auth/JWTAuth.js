import createHttpError from "http-errors";
import { verifyAccessToken } from "../Tools/tools.js";

export const loginFirstMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(createHttpError(401, "No Bearer Token provided!"));
  } else {
    try {
      const accessToken = req.headers.authorization.replace("Bearer ", "");

      const payload = await verifyAccessToken(accessToken);

      req.user = {
        _id: payload._id,
        role: payload.role,
      };
      next();
    } catch (error) {
      console.log(error);
      next(createHttpError(401, "Token not valid!"));
    }
  }
};
