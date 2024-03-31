import mongoose from "mongoose";
import { ReservationDoc } from "./IReservation";
const Schema = mongoose.Schema; // strucuture for a class

const ReservationSchema = new Schema(
  {
    ReservationID: String,
    GuestFirstName: String,
    GuestLastName: String,
    ReservationStartDate: String,
    ReservationEndDate: String,
    NumberOfGuests: Number,
    RoomNumber: Number,
    RoomType: String,
    RoomStatus: String,
    BillingUnitNumber: String,
    BillingStreetNumber: String,
    BillingStreetName: String,
    BillingCity: String,
    BillingProvince: String,
    BillingCountry: String,
    BillingPostalCode: String,
    EmailAddress: String,
  },
  {
    collection: "reservations",
  }
);

const Model = mongoose.model<ReservationDoc>("Reservation", ReservationSchema);
export default Model;
