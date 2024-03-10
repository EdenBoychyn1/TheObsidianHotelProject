"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/", function (req, res, next) {
    res.render("index", { title: "Home", page: "home" });
});
router.get("/home", function (req, res, next) {
    res.render("index", { title: "Home", page: "home" });
});
router.get("/about", function (req, res, next) {
    res.render("index", { title: "About Us", page: "about" });
});
router.get("/gallery", function (req, res, next) {
    res.render("index", { title: "Gallery", page: "gallery" });
});
router.get("/rooms", function (req, res, next) {
    res.render("index", { title: "Room", page: "rooms" });
});
router.get("/login", function (req, res, next) {
    res.render("index", { title: "Login", page: "login" });
});
router.get("/reservation", function (req, res, next) {
    res.render("index", { title: "Reservations", page: "reservation" });
});
router.get("/employee-register", function (req, res, next) {
    res.render("index", {
        title: "Employee Registration ",
        page: "employee-register",
    });
});
router.get("/register", function (req, res, next) {
    res.render("index", {
        title: "Guest Registration ",
        page: "register",
    });
});
router.get("/reservation-edit", function (req, res, next) {
    res.render("index", {
        title: "Edit Reservation",
        page: "reservation-edit",
    });
});
router.get("/reservation-list", function (req, res, next) {
    res.render("index", {
        title: "Reservation List",
        page: "reservation-list",
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map