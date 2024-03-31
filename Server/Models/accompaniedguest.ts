import mongoose, { PassportLocalSchema } from "mongoose";
const Schema = mongoose.Schema; // strucuture for a class

import passportLocalMongoose from "passport-local-mongoose";

const AccompaniedGuestSchema = new Schema(
  {
    FirstName: String,
    LastName: String,
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

AccompaniedGuestSchema.plugin(passportLocalMongoose);

const Model = mongoose.model("Guest", AccompaniedGuestSchema);

declare global {
  export type AccompaniedGuestDocument = mongoose.Document & {
    FirstName: String;
    LastName: String;
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
