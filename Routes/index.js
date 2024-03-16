"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const reservation_1 = __importDefault(require("../Models/reservation"));
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
    let username = req.body.userName;
    let password = req.body.password;
    console.log(username, password);
    res.render("index", {
        title: "Login",
        page: "login",
    });
});
router.post("/login", function (req, res, next) {
});
router.get("/about", (req, res) => {
    res.render("/index", {
        title: "About Us",
        page: "about",
    });
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
router.get("/reservation-list", async (req, res, next) => {
    try {
        const reservationsCollection = await reservation_1.default.find({}).exec();
        res.render("index", {
            title: "Reservation List",
            page: "reservation-list",
            displayName: "",
            reservations: reservationsCollection,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/add", function (req, res, next) {
    res.render("index", {
        title: "Add",
        page: "reservation-edit",
        reservation: "",
        displayName: "",
    });
});
router.get("/delete/:EmailAddress", async function (req, res, next) {
    try {
        let emailAddress = req.params.EmailAddress;
        await reservation_1.default.deleteOne({ EmailAddress: emailAddress });
        res.redirect("/reservation-list");
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/reservation-edit/:EmailAddress", async (req, res, next) => {
    const emailAddress = req.params.EmailAddress;
    try {
        const reservation = await reservation_1.default.aggregate([
            {
                $match: { EmailAddress: emailAddress },
            },
            {
                $lookup: {
                    from: "guests",
                    localField: "EmailAddress",
                    foreignField: "EmailAddress",
                    as: "guest",
                },
            },
        ]).exec();
        reservation.forEach((mergedDocument, index) => {
            console.log(`Merged Document ${index + 1}:`, mergedDocument);
            console.log(`Reservation ID:`, mergedDocument.ReservationID);
            console.log(`Guest First Name:`, mergedDocument.guest[0].FirstName);
            if (Array.isArray(mergedDocument.guest) &&
                mergedDocument.guest.length > 0) {
                const firstGuest = mergedDocument.guest[0];
                if (firstGuest.FirstName) {
                    console.log(`Guest First Name:`, firstGuest.FirstName);
                }
                else {
                    console.log(`Guest First Name is not available`);
                }
            }
            else {
                console.log(`No guest information available`);
            }
        });
        return res.render("index", {
            title: "Edit",
            page: "reservation-edit",
            reservation: reservation,
            displayName: "",
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/reservation-edit/:EmailAddress", async (req, res, next) => {
    console.log("Hello");
    try {
        let emailAddress = req.params.EmailAddress;
        let reservationStartDate = req.body.inputCheckInDate;
        let reservationEndDate = req.body.inputCheckOutDate;
        let billingUnitNumber = req.body.inputUnitNumber;
        let billingCity = req.body.inputCity;
        let billingProvince = req.body.inputProvince;
        let billingPostalCode = req.body.inputPostalCode;
        let address = req.body.inputAddress;
        let addressSplit = address.split(" ");
        let streetNumber = addressSplit[0];
        let streetName = addressSplit[1];
        for (let i = 2; i < addressSplit.length; i++) {
            streetName += " " + addressSplit[i];
        }
        console.log(`Updated Reservation: ${reservationStartDate}`);
        let updatedReservation = await reservation_1.default.findOneAndUpdate({ EmailAddress: emailAddress }, {
            $set: {
                ReservationStartDate: reservationStartDate,
                ReservationEndDate: reservationEndDate,
                BillingUnitNumber: billingUnitNumber,
                BillingStreetNumber: streetNumber,
                BillingStreetName: streetName,
                BillingCity: billingCity,
                BillingProvince: billingProvince,
                BillingPostalCode: billingPostalCode,
            },
        }).exec();
        console.log(`Billing Province ${updatedReservation?.BillingProvince}`);
        res.redirect("/reservation-list");
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map