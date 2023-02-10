import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const AccomodationsSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    maxGuests: { type: Number, required: true },
    location: { type: String, required: true },
    host: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default model("Accomodation", AccomodationsSchema);
