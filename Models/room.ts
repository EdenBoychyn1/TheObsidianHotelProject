import mongoose from "mongoose";
const Schema = mongoose.Schema; // strucuture for a class

const RoomSchema = new Schema(
  {
    RoomNumber: Number,
    ReservationStartDate: String,
    ReservationEndDate: String,
    RoomDescription: String,
    RoomType: String,
    RoomPrice: Number,
    RoomStatus: String,
    RoomAccessible: Boolean,
  },
  {
    collection: "rooms",
  }
);

const Model = mongoose.model("Room", RoomSchema);
export default Model;
