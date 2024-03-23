import mongoose from "mongoose";

export interface RoomDoc extends mongoose.Document {
  RoomNumber: Number;
  ReservationStartDate: String;
  ReservationEndDate: String;
  RoomDescription: String;
  RoomType: String;
  RoomPrice: Number;
  RoomStatus: String;
  RoomAccessible: Boolean;
  ReservationID: String;
}
