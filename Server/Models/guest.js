"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const passport_local_mongoose_1 = __importDefault(require("passport-local-mongoose"));
const GuestSchema = new Schema({
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
}, {
    collection: "guests",
});
GuestSchema.plugin(passport_local_mongoose_1.default);
const Model = mongoose_1.default.model("Guest", GuestSchema);
exports.default = Model;
//# sourceMappingURL=guest.js.map