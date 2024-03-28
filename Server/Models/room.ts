import mongoose from "mongoose";
import { RoomDoc } from "./IRoom";
const Schema = mongoose.Schema; // strucuture for a class

const RoomSchema = new Schema(
  {
    RoomNumber: Number,
    RoomDescription: String,
    RoomType: String,
    RoomPrice: Number,
    RoomStatus: String,
    RoomAccessible: Boolean,
    ReservationID: String,
  },
  {
    collection: "rooms",
  }
);

const Model = mongoose.model<RoomDoc>("Room", RoomSchema);
export default Model;
