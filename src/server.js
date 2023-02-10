import express from "express";
import listEndpoint from "express-list-endpoints";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";

import usersRouter from "./api/user/user.js";
import accomodationRouter from "./api/accomodation/accomodation.js";

const server = express();
const port = 3002;

server.use(express.json());
server.use(cors());

server.use("/users", usersRouter);
server.use("/accomodations", accomodationRouter);

const mongoURL = process.env.MONGODB_URL;

mongoose.connect(mongoURL);

mongoose.connection.on("connected", () => {
  console.log("DB Connected");
  server.listen(port, () => {
    console.log(`listening on port ${port}`);
    console.table(listEndpoints(server));
    console.table(listEndpoint(server));
  });
});
