"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guest = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const passport_local_mongoose_1 = __importDefault(require("passport-local-mongoose"));
const userSchema = new mongoose_1.Schema({
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    username: { type: String, required: true },
    SecurityLevel: { type: String, required: true },
    EmailAddress: { type: String, required: true },
    DateCreated: { type: Date, default: Date.now },
    LastUpdate: { type: Date, default: Date.now },
    userType: { type: String, enum: ["employee", "guest"], required: true },
});
userSchema.plugin(passport_local_mongoose_1.default);
const guestSchema = new mongoose_1.Schema({
    UnitNumber: { type: String, required: false },
    StreetNumber: { type: String, required: true },
    StreetName: { type: String, required: true },
    City: { type: String, required: true },
    Province: { type: String, required: true },
    Country: { type: String, required: true },
    PostalCode: { type: String, required: true },
});
exports.User = mongoose_1.default.model("User", userSchema);
exports.Guest = exports.User.discriminator("Guest", guestSchema);
//# sourceMappingURL=user.js.map