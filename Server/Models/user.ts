import mongoose, { PassportLocalSchema } from "mongoose";
const Schema = mongoose.Schema; // strucuture for a class
// import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new Schema(
  {
    FirstName: String,
    LastName: String,
    UserName: String,
    SecurityLevel: String,
    EmailAddress: String,
    Password: String,
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

// UserSchema.plugin(passportLocalMongoose);

const Model = mongoose.model("User", UserSchema);
export default Model;
