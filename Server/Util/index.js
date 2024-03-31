"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = exports.FindEmailAddress = exports.UserSecurityLevel = void 0;
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
function AuthGuard(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    next();
}
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=index.js.map