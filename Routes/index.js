"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const reservation_1 = __importDefault(require("../Models/reservation"));
const guest_1 = __importDefault(require("../Models/guest"));
const user_1 = __importDefault(require("../Models/user"));
const mongoose_1 = __importDefault(require("mongoose"));
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
    console.log("Hello");
    res.render("index", {
        title: "Employee Registration ",
        page: "employee-register",
    });
});
router.post("/employee-register", async (req, res, next) => {
    try {
        let newEmployee = new user_1.default({
            FirstName: req.body.firstName,
            LastName: req.body.lastName,
            UserName: req.body.emailAddress,
            SecurityLevel: "FrontDeskAgent",
            EmailAddress: req.body.emailAddress,
            Password: req.body.password,
        });
        console.log(newEmployee);
        await newEmployee.save();
        res.redirect("./login");
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/register", function (req, res, next) {
    res.render("index", {
        title: "Guest Registration ",
        page: "register",
    });
});
router.post("/register", async (req, res, next) => {
    try {
        let address = req.body.inputAddress;
        console.log(address);
        let addressSplit = address.split(" ");
        let streetNumber = addressSplit[0];
        let streetName = addressSplit[1];
        for (let i = 2; i < addressSplit.length; i++) {
            streetName += " " + addressSplit[i];
        }
        let newGuest = new guest_1.default({
            FirstName: req.body.firstName,
            LastName: req.body.lastName,
            UserName: req.body.emailAddress,
            SecurityLevel: "Guest",
            EmailAddress: req.body.emailAddress,
            Password: req.body.password,
            UnitNumber: req.body.inputUnitNumber,
            StreetNumber: streetNumber,
            StreetName: streetName,
            City: req.body.inputCity,
            Province: req.body.inputProvince,
            Country: req.body.inputCountry,
            PostalCode: req.body.inputPostalCode,
        });
        console.log(newGuest);
        await newGuest.save();
        res.redirect("./login");
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
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
router.get("/check-in/:EmailAddress/:ReservationStartDate/:ReservationEndDate/:RoomNumber/:id", async function (req, res, next) {
    try {
        let id = req.params.id;
        let emailAddress = req.params.EmailAddress;
        let roomNumber = req.params.RoomNumber;
        let reservationStartDate = req.params.ReservationStartDate;
        let reservationEndDate = req.params.ReservationEndDate;
        console.log(`room number ${roomNumber}, Reservation Start Date: ${reservationStartDate}, Reservation End Date: ${reservationEndDate}`);
        const findId = await reservation_1.default.findById({
            _id: id,
        }).exec();
        const checkedInReservation = await reservation_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(id),
                },
            },
            {
                $lookup: {
                    from: "rooms",
                    let: {
                        roomNumber: "$RoomNumber",
                        startDate: "$ReservationStartDate",
                        endDate: "$ReservationEndDate",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$RoomNumber", roomNumber] },
                                        { $eq: ["$ReservationStartDate", reservationStartDate] },
                                        { $eq: ["$ReservationEndDate", reservationEndDate] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "roomDetails",
                },
            },
        ]);
        checkedInReservation.forEach((mergedDocument, index) => {
            console.log(`Merged Document ${index + 1}:`, mergedDocument);
            console.log(`Room Details:`, mergedDocument.roomDetails[0]);
            if (Array.isArray(mergedDocument.roomDetails) &&
                mergedDocument.roomDetails.length > 0) {
                const matchedReso = mergedDocument.roomDetails[0];
                if (matchedReso.RoomNumber) {
                    console.log(`Room Number:`, matchedReso.RoomNumber);
                }
                else {
                    console.log(`Guest First Name is not available`);
                }
            }
            else {
                console.log(`No guest information available`);
            }
        });
        res.redirect("/reservation-list");
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
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
    let emailAddress = req.params.EmailAddress;
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