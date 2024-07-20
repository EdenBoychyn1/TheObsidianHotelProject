"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = exports.StreetName = exports.StreetNumber = exports.FindEmailAddress = exports.UserSecurityLevel = void 0;
function UserSecurityLevel(req) {
    if (req.user) {
        let user = req.user;
        return user.userType.toString();
    }
    return "";
}
exports.UserSecurityLevel = UserSecurityLevel;
function FindEmailAddress(req) {
    if (req.user) {
        let user = req.user;
        return user.EmailAddress.toString();
    }
    else {
        return "";
    }
}
exports.FindEmailAddress = FindEmailAddress;
function StreetNumber(req) {
    let address = req.body.inputAddress.split(" ");
    let streetNumber;
    if (address != null) {
        streetNumber = address[0];
    }
    return streetNumber;
}
exports.StreetNumber = StreetNumber;
function StreetName(req) {
    let address = req.body.inputAddress.split(" ");
    let streetName;
    if (address != null) {
        streetName = address[1];
        for (let i = 2; i < address.length; i++) {
            streetName += " " + address[i];
        }
    }
    return streetName;
}
exports.StreetName = StreetName;
function AuthGuard(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    next();
}
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=index.js.map