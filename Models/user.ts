import mongoose from "mongoose";
const Schema = mongoose.Schema; // strucuture for a class

const UserSchema = new Schema(
  {
    FirstName: String,
    LastName: String,
    UserName: String,
    SecurityLevel: String,
    EmailAddress: String,
    Password: String,
  },
  {
    collection: "users",
  }
);

const Model = mongoose.model("User", UserSchema);
export default Model;
