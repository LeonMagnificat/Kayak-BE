import express from "express";
import { createAccessToken } from "../../library/Tools/tools.js";
import UsersModel from "./model.js";
import createHttpError from "http-errors";
import { loginFirstMiddleware } from "../../library/Auth/JWTAuth.js";

const usersRouter = express.Router();

//----------------------------Register------------------------------------

usersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body);
    const payload = { _id: newUser._id, role: newUser.role };
    const accessToken = await createAccessToken(payload);
    await newUser.save();
    res.status(201).send({ accessToken });
  } catch (error) {
    next(error);
  }
});

//----------------------------Login------------------------------------

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UsersModel.checkCredentials(email, password);

    if (user) {
      const payload = { _id: user._id, role: user.role };

      const accessToken = await createAccessToken(payload);
      res.send({ accessToken });
    } else {
      next(createHttpError(401, "Credentials are not here"));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/", async (req, res, next) => {
  try {
    const Users = await UsersModel.find();
    res.status(201).send(Users);
  } catch (error) {
    next(error);
  }
});
usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/user/me", loginFirstMiddleware, async (req, res, next) => {
  try {
    const myProfile = await UsersModel.findById(req.user._id);
    res.send(myProfile);
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const user = await UsersModel.findByIdAndUpdate(req.params.userId, req.body, { new: true, runValidators: true });
    res.send(user);
  } catch (error) {
    next(error);
  }
});
usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const user = await UsersModel.findByIdAndDelete(req.params.userId);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/me/accomodations", loginFirstMiddleware, async (req, res, next) => {
  const user = await UsersModel.findById(req.user._id).populate({ path: "accomodation", select: ["_id", "name", "maxGuests", "location"] });
  res.send(user.accomodation);
});

export default usersRouter;
