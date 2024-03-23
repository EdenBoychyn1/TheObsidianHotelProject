import mongoose from "mongoose";
const Schema = mongoose.Schema; // strucuture for a class

const GuestSchema = new Schema(
  {
    FirstName: String,
    LastName: String,
    UserName: String,
    SecurityLevel: String,
    EmailAddress: String,
    Password: String,
    UnitNumber: String,
    StreetNumber: String,
    StreetName: String,
    City: String,
    Province: String,
    Country: String,
    PostalCode: String,
    DateCreated: Number,
    LastUpdate: Number,
  },
  {
    collection: "guests",
  }
);

const Model = mongoose.model("Guest", GuestSchema);
export default Model;
