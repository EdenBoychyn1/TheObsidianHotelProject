import mongoose, { PassportLocalSchema } from "mongoose";
const Schema = mongoose.Schema; // strucuture for a class
import passportLocalMongoose from "passport-local-mongoose";

const GuestSchema = new Schema(
  {
    FirstName: String,
    LastName: String,
    username: String,
    SecurityLevel: String,
    EmailAddress: String,
    UnitNumber: String,
    StreetNumber: String,
    StreetName: String,
    City: String,
    Province: String,
    Country: String,
    PostalCode: String,
    DateCreated: {
      type: Date,
      default: Date.now(),
    },
    LastUpdate: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    collection: "guests",
  }
);

GuestSchema.plugin(passportLocalMongoose);

const Model = mongoose.model("Guest", GuestSchema);

declare global {
  export type GuestDocument = mongoose.Document & {
    FirstName: String;
    LastName: String;
    username: String;
    SecurityLevel: String;
    EmailAddress: String;
    UnitNumber: String;
    StreetNumber: String;
    StreetName: String;
    City: String;
    Province: String;
    Country: String;
    PostalCode: String;
  };
}

export default Model;
