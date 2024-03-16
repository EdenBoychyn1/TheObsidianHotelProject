"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const RoomSchema = new Schema({
    RoomNumber: Number,
    ReservationStartDate: String,
    ReservationEndDate: String,
    RoomDescription: String,
    RoomType: String,
    RoomPrice: Number,
    RoomStatus: String,
    RoomAccessible: Boolean,
}, {
    collection: "rooms",
});
const Model = mongoose_1.default.model("Room", RoomSchema);
exports.default = Model;
//# sourceMappingURL=room.js.map