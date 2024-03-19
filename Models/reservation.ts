import mongoose from "mongoose";
const Schema = mongoose.Schema; // strucuture for a class

const ReservationSchema = new Schema(
  {
    ReservationID: String,
    ReservationStartDate: String,
    ReservationEndDate: String,
    NumberOfGuests: Number,
    RoomNumber: Number,
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

const Model = mongoose.model("Reservation", ReservationSchema);
export default Model;
