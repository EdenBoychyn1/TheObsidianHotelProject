"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ReservationSchema = new Schema({
    ReservationID: String,
    ReservationStartDate: String,
    ReservationEndDate: String,
    NumberOfGuests: Number,
    RoomNumber: Number,
    BillingUnitNumber: String,
    BillingStreetNumber: String,
    BillingStreetName: String,
    BillingCity: String,
    BillingProvince: String,
    BillingCountry: String,
    BillingPostalCode: String,
    DateCreated: Number,
    LastUpdate: Number,
    EmailAddress: String,
}, {
    collection: "reservations",
});
const Model = mongoose_1.default.model("Reservation", ReservationSchema);
exports.default = Model;
//# sourceMappingURL=reservation.js.map