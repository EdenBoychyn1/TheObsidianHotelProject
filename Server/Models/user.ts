import mongoose, { PassportLocalSchema } from "mongoose";
const Schema = mongoose.Schema; // strucuture for a class
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new Schema(
  {
    FirstName: String,
    LastName: String,
    username: String,
    SecurityLevel: String,
    EmailAddress: String,
    // password: String,
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
    collection: "users",
  }
);

UserSchema.plugin(passportLocalMongoose);

const Model = mongoose.model("User", UserSchema);

declare global {
  export type UserDocument = mongoose.Document & {
    FirstName: String;
    LastName: String;
    username: String;
    SecurityLevel: String;
    EmailAddress: String;
  };
}
export default Model;
