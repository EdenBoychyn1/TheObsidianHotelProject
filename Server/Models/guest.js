"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const GuestSchema = new Schema({
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
}, {
    collection: "guests",
});
const Model = mongoose_1.default.model("Guest", GuestSchema);
exports.default = Model;
//# sourceMappingURL=guest.js.map