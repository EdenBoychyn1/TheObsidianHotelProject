import mongoose, { Schema, Document } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

// Define common fields interface
interface CommonFields {
  FirstName: string;
  LastName: string;
  username: string;
  password: string;
  SecurityLevel: string;
  EmailAddress: string;
  DateCreated: Date;
  LastUpdate: Date;
}

// Define guest-specific fields interface
interface GuestFields {
  ConfirmPassword: string;
  UnitNumber: string;
  StreetNumber: string;
  StreetName: string;
  City: string;
  Province: string;
  Country: string;
  PostalCode: string;
}

// Define employee-specific fields interface if needed

// Union type for discriminating between user types
type UserType = "employee" | "guest";

// Define base user document interface
interface UserDocument extends Document, CommonFields {
  userType: UserType;
}

// Define guest user document interface
interface GuestDocument extends UserDocument, GuestFields {}

// Define employee user document interface if needed

// Define base user schema
const userSchema: Schema<UserDocument> = new Schema({
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  username: { type: String, required: true },
  SecurityLevel: { type: String, required: true },
  EmailAddress: { type: String, required: true },
  DateCreated: { type: Date, default: Date.now },
  LastUpdate: { type: Date, default: Date.now },
  userType: { type: String, enum: ["employee", "guest"], required: true },
});

// Add plugin for handling password and authentication
userSchema.plugin(passportLocalMongoose);

// Define guest user schema with additional fields
const guestSchema: Schema<GuestDocument> = new Schema({
  UnitNumber: { type: String, required: false },
  StreetNumber: { type: String, required: true },
  StreetName: { type: String, required: true },
  City: { type: String, required: true },
  Province: { type: String, required: true },
  Country: { type: String, required: true },
  PostalCode: { type: String, required: true },
});

// Create and export models
export const User = mongoose.model<UserDocument>("User", userSchema);
export const Guest = User.discriminator<GuestDocument>("Guest", guestSchema);
// Export Employee if needed as well
