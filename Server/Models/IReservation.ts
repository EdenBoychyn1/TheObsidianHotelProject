import mongoose from "mongoose";

export interface ReservationDoc extends mongoose.Document {
  ReservationID: String;
  ReservationStartDate: String;
  ReservationEndDate: String;
  NumberOfGuests: Number;
  RoomNumber: Number;
  RoomType: String;
  RoomStatus: String;
  BillingUnitNumber: String;
  BillingStreetNumber: String;
  BillingStreetName: String;
  BillingCity: String;
  BillingProvince: String;
  BillingCountry: String;
  BillingPostalCode: String;
  EmailAddress: String;
}
