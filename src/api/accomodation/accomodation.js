import express from "express";
import AccomodationsModel from "./model.js";
import { loginFirstMiddleware } from "../../library/Auth/JWTAuth.js";
import { hostsOnlyMiddleware } from "../../library/Auth/HostsAuth.js";
import createHttpError from "http-errors";
import UsersModel from "../user/model.js";

const accomodationRouter = express.Router();

accomodationRouter.post("/", loginFirstMiddleware, hostsOnlyMiddleware, async (req, res, next) => {
  try {
    const newAccomodation = await AccomodationsModel(req.body);
    const { _id } = await newAccomodation.save();
    const host = await UsersModel.findByIdAndUpdate(req.user._id, { $push: { accomodation: _id } }, { new: true, runValidators: true });
    res.status(201).send({ newAccomodation, host });
  } catch (error) {
    next(error);
  }
});
accomodationRouter.get("/", loginFirstMiddleware, hostsOnlyMiddleware, async (req, res, next) => {
  try {
    const Accomodations = await AccomodationsModel.find();
    console.log(req.user);
    res.status(201).send(Accomodations);
  } catch (error) {
    next(error);
  }
});
accomodationRouter.get("/:accomodationId", loginFirstMiddleware, async (req, res, next) => {
  try {
    const accomodation = await AccomodationsModel.findById(req.params.accomodationId);
    if (accomodation) {
      res.send(accomodation);
    } else {
      createHttpError(404, "User not found");
    }
  } catch (error) {
    next(error);
  }
});

accomodationRouter.put("/:accomodationId", loginFirstMiddleware, hostsOnlyMiddleware, async (req, res, next) => {
  try {
    const accomodation = await AccomodationsModel.findByIdAndUpdate(req.params.accomodationId, req.body, { new: true, runValidators: true });
    res.send(accomodation);
  } catch (error) {
    next(error);
  }
});
accomodationRouter.delete("/:accomodationId", loginFirstMiddleware, hostsOnlyMiddleware, async (req, res, next) => {
  try {
    const accomodation = await AccomodationsModel.findByIdAndDelete(req.params.accomodationId);
    res.send(accomodation);
  } catch (error) {
    next(error);
  }
});

export default accomodationRouter;
