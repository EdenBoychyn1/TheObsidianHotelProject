"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const reservation_1 = __importDefault(require("../Models/reservation"));
const room_1 = __importDefault(require("../Models/room"));
const user_1 = require("../Models/user");
const passport_1 = __importDefault(require("passport"));
const Util_1 = require("../Util");
router.get("/", function (req, res, next) {
    res.render("index", {
        title: "Home",
        page: "home",
        userType: (0, Util_1.UserSecurityLevel)(req),
        emailaddress: (0, Util_1.FindEmailAddress)(req),
    });
});
router.get("/home", function (req, res, next) {
    res.render("index", {
        title: "Home",
        page: "home",
        userType: (0, Util_1.UserSecurityLevel)(req),
        emailaddress: (0, Util_1.FindEmailAddress)(req),
    });
});
router.get("/gallery", function (req, res, next) {
    res.render("index", {
        title: "Gallery",
        page: "gallery",
        userType: (0, Util_1.UserSecurityLevel)(req),
        emailaddress: (0, Util_1.FindEmailAddress)(req),
    });
});
router.get("/rooms", function (req, res, next) {
    res.render("index", {
        title: "Room",
        page: "rooms",
        userType: (0, Util_1.UserSecurityLevel)(req),
        emailaddress: (0, Util_1.FindEmailAddress)(req),
    });
});
router.get("/login", function (req, res, next) {
    if (!req.user) {
        res.render("index", {
            title: "Login",
            page: "login",
            userType: "",
            messages: req.flash("loginMessage"),
            emailaddress: (0, Util_1.FindEmailAddress)(req),
        });
    }
    return res.redirect("/");
});
router.get("/logout", function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/login");
    });
});
router.post("/login", function (req, res, next) {
    console.log("Hello");
    passport_1.default.authenticate("local", function (err, user, info) {
        if (err) {
            console.log("Hello1");
            console.error(err);
            res.end(err);
        }
        if (!user) {
            console.log("Hello3");
            console.log(`user ${user}`);
            req.flash("loginMessage", "Authentication Error");
            return res.redirect("/login");
        }
        req.logIn(user, function (err) {
            if (err) {
                console.error(err);
                res.end(err);
            }
            const userType = user.userType;
            res.render("index", {
                title: "Home",
                page: "home",
                userType: userType,
                emailaddress: (0, Util_1.FindEmailAddress)(req),
            });
        });
    })(req, res, next);
});
router.get("/reservation", function (req, res, next) {
    res.render("index", {
        title: "Reservations",
        page: "reservation",
        userType: (0, Util_1.UserSecurityLevel)(req),
        emailaddress: (0, Util_1.FindEmailAddress)(req),
    });
});
router.get("/employee-register", function (req, res, next) {
    if (req.user) {
        res.render("index", {
            title: "Employee Registration",
            page: "employee-register",
            userType: (0, Util_1.UserSecurityLevel)(req),
            messages: req.flash("registerMessage"),
            emailaddress: (0, Util_1.FindEmailAddress)(req),
        });
    }
    return res.redirect("/");
});
router.post("/employee-register", function (req, res, next) {
    console.log("Hello");
    let newEmployee = new user_1.User({
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        username: req.body.emailAddress,
        SecurityLevel: "FrontDeskAgent",
        EmailAddress: req.body.emailAddress,
        userType: "employee",
    });
    console.log("Hello1");
    user_1.User.register(newEmployee, req.body.password, function (err) {
        if (err) {
            console.log("Hello2");
            if (err.name == "UserExistsError") {
                console.error("ERROR: User already exists!");
                req.flash("registerMessage", "Registration Error");
            }
            else {
                console.error(err.name);
                req.flash("registerMessage", "Server Error");
            }
            console.log("Hello3");
            return res.redirect("/employee-register");
        }
        return res.redirect("/reservation-list");
    });
});
router.get("/register", function (req, res, next) {
    res.render("index", {
        title: "Guest Registration ",
        page: "register",
        userType: (0, Util_1.UserSecurityLevel)(req),
        messages: "",
        emailaddress: (0, Util_1.FindEmailAddress)(req),
    });
});
router.post("/register", async (req, res, next) => {
    {
        try {
            let address = req.body.inputAddress;
            let addressSplit = address.split(" ");
            let streetNumber = addressSplit[0];
            let streetName = addressSplit[1];
            for (let i = 2; i < addressSplit.length; i++) {
                streetName += " " + addressSplit[i];
            }
            let newGuest = new user_1.Guest({
                FirstName: req.body.firstName,
                LastName: req.body.lastName,
                username: req.body.emailAddress,
                SecurityLevel: "Guest",
                EmailAddress: req.body.emailAddress,
                userType: "guest",
                UnitNumber: req.body.inputUnitNumber,
                StreetNumber: streetNumber,
                StreetName: streetName,
                City: req.body.inputCity,
                Province: req.body.inputProvince,
                Country: req.body.inputCountry,
                PostalCode: req.body.inputPostalCode,
            });
            await user_1.User.register(newGuest, req.body.password);
            return res.redirect("/");
        }
        catch (error) {
            console.error("Error registering guest:", error);
            req.flash("registerMessage", "Server Error");
            return res.redirect("/register");
        }
    }
});
router.get("/reservation-list", async (req, res, next) => {
    try {
        if (req.user) {
            const reservationsCollection = await reservation_1.default.find({}).exec();
            res.render("index", {
                title: "Reservation List",
                page: "reservation-list",
                userType: (0, Util_1.UserSecurityLevel)(req),
                reservations: reservationsCollection,
                emailaddress: (0, Util_1.FindEmailAddress)(req),
            });
        }
        else {
            return res.redirect("/");
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/guest-reservation", async (req, res, next) => {
    try {
        if (req.user) {
            const reservationsCollection = await reservation_1.default.find({
                EmailAddress: (0, Util_1.FindEmailAddress)(req),
            }).exec();
            res.render("index", {
                title: "Your Reservations",
                page: "guest-reservation",
                userType: (0, Util_1.UserSecurityLevel)(req),
                reservations: reservationsCollection,
                emailaddress: (0, Util_1.FindEmailAddress)(req),
            });
        }
        else {
            return res.redirect("/");
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/reservation-add", function (req, res, next) {
    res.render("index", {
        title: "Add",
        page: "reservation-add",
        reservation: "",
        userType: (0, Util_1.UserSecurityLevel)(req),
        emailaddress: (0, Util_1.FindEmailAddress)(req),
    });
});
router.post("/reservation", async function (req, res, next) {
    console.log(`EmailAddress: ${req.body.emailAddress}`);
    try {
        let firstName = req.body.inputReservationFirstName;
        let lastName = req.body.inputReservationLastName;
        let unitNumber = req.body.inputUnitNumber;
        let city = req.body.inputCity;
        let province = req.body.inputProvince;
        let country = req.body.inputCountry;
        let postalCode = req.body.inputPostalCode;
        let reservationStartDate = req.body.inputCheckInDate;
        let reservationEndDate = req.body.inputCheckOutDate;
        let numberOfGuests = req.body.inputPax;
        let roomType = req.body.inputRoomType;
        let reservationId = req.body.inputReservationLastName + Date.now();
        let emailAddress = req.body.inputEmailAddress;
        let address = req.body.inputAddress;
        let addressSplit = address.split(" ");
        let streetNumber = addressSplit[0];
        let streetName = addressSplit[1];
        for (let i = 2; i < addressSplit.length; i++) {
            streetName += " " + addressSplit[i];
        }
        const roomCollection = await room_1.default.find({
            RoomType: roomType,
        }).exec();
        let conflictFound = false;
        let newRoomNumber;
        for (let index = 0; index < roomCollection.length; index++) {
            console.log(`Room Number: ${roomCollection[index].RoomNumber}`);
            const reservation = await reservation_1.default.find({
                RoomNumber: roomCollection[index].RoomNumber,
            });
            console.log(`Room Collection Length ${roomCollection.length}`);
            for (let j = 0; j < reservation.length; j++) {
                const documentsReservationStartDate = reservation[j].ReservationStartDate;
                const documentsReservationEndDate = reservation[j].ReservationEndDate;
                console.log(`Proposed Reservation Start Date: ${reservationStartDate}, Reservation Start Date of already Created Reservation ${documentsReservationStartDate}`);
                console.log(`Reservation Length ${reservation.length}`);
                console.log(`Reservation: ${reservation[index]}`);
                if (reservationStartDate === documentsReservationStartDate ||
                    reservationEndDate === documentsReservationEndDate) {
                    console.log("Reservation conflicts with an existing reservation");
                    conflictFound = true;
                }
            }
            if (conflictFound) {
                console.log(`Conflict Found ${conflictFound}`);
            }
            else {
                newRoomNumber = roomCollection[index].RoomNumber;
            }
        }
        if (!conflictFound) {
            let newReservation = new reservation_1.default({
                ReservationID: reservationId,
                GuestFirstName: firstName,
                GuestLastName: lastName,
                ReservationStartDate: reservationStartDate,
                ReservationEndDate: reservationEndDate,
                NumberOfGuests: numberOfGuests,
                RoomNumber: newRoomNumber,
                RoomType: roomType,
                RoomStatus: "Reserved",
                BillingUnitNumber: unitNumber,
                BillingStreetNumber: streetNumber,
                BillingStreetName: streetName,
                BillingCity: city,
                BillingProvince: province,
                BillingCountry: country,
                BillingPostalCode: postalCode,
                EmailAddress: emailAddress,
            });
            await newReservation.save();
        }
        res.redirect("/");
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});
router.post("/reservation-add", async function (req, res, next) {
    try {
        let firstName = req.body.inputReservationFirstName;
        let lastName = req.body.inputReservationLastName;
        let unitNumber = req.body.inputUnitNumber;
        let city = req.body.inputCity;
        let province = req.body.inputProvince;
        let country = req.body.inputCountry;
        let postalCode = req.body.inputPostalCode;
        let reservationStartDate = req.body.inputCheckInDate;
        let reservationEndDate = req.body.inputCheckOutDate;
        let numberOfGuests = req.body.inputPax;
        let roomType = req.body.inputRoomType;
        let reservationId = req.body.inputReservationLastName + Date.now();
        let emailAddress = req.body.inputEmailAddress;
        let address = req.body.inputAddress;
        let addressSplit = address.split(" ");
        let streetNumber = addressSplit[0];
        let streetName = addressSplit[1];
        for (let i = 2; i < addressSplit.length; i++) {
            streetName += " " + addressSplit[i];
        }
        const roomCollection = await room_1.default.find({
            RoomType: roomType,
        }).exec();
        let conflictFound = false;
        let newRoomNumber;
        for (let index = 0; index < roomCollection.length; index++) {
            console.log(`Room Number: ${roomCollection[index].RoomNumber}`);
            const reservation = await reservation_1.default.find({
                RoomNumber: roomCollection[index].RoomNumber,
            });
            console.log(`Room Collection Length ${roomCollection.length}`);
            for (let j = 0; j < reservation.length; j++) {
                const documentsReservationStartDate = reservation[j].ReservationStartDate;
                const documentsReservationEndDate = reservation[j].ReservationEndDate;
                console.log(`Proposed Reservation Start Date: ${reservationStartDate}, Reservation Start Date of already Created Reservation ${documentsReservationStartDate}`);
                console.log(`Reservation Length ${reservation.length}`);
                console.log(`Reservation: ${reservation[index]}`);
                if (reservationStartDate === documentsReservationStartDate ||
                    reservationEndDate === documentsReservationEndDate) {
                    console.log("Reservation conflicts with an existing reservation");
                    conflictFound = true;
                }
            }
            if (conflictFound) {
                console.log(`Conflict Found ${conflictFound}`);
            }
            else {
                newRoomNumber = roomCollection[index].RoomNumber;
            }
        }
        if (!conflictFound) {
            let newReservation = new reservation_1.default({
                ReservationID: reservationId,
                GuestFirstName: firstName,
                GuestLastName: lastName,
                ReservationStartDate: reservationStartDate,
                ReservationEndDate: reservationEndDate,
                NumberOfGuests: numberOfGuests,
                RoomNumber: newRoomNumber,
                RoomType: roomType,
                RoomStatus: "Reserved",
                BillingUnitNumber: unitNumber,
                BillingStreetNumber: streetNumber,
                BillingStreetName: streetName,
                BillingCity: city,
                BillingProvince: province,
                BillingCountry: country,
                BillingPostalCode: postalCode,
                EmailAddress: emailAddress,
            });
            await newReservation.save();
        }
        res.redirect("/reservation-list");
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/check-in/:ReservationID", async function (req, res, next) {
    try {
        let reservationId = req.params.ReservationID;
        const roomReservationId = await reservation_1.default.findOneAndUpdate({ ReservationID: reservationId }, { $set: { RoomStatus: "Checked In" } }).exec();
        console.log(`ReservationID: ${roomReservationId?.ReservationID}, Room Status: ${roomReservationId?.RoomStatus}`);
        res.redirect("/reservation-list");
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/check-out/:ReservationID", async function (req, res, next) {
    try {
        let reservationId = req.params.ReservationID;
        const roomReservationId = await reservation_1.default.findOneAndUpdate({ ReservationID: reservationId }, { $set: { RoomStatus: "Checked Out" } }).exec();
        console.log(`ReservationID: ${roomReservationId?.ReservationID}, Room Status: ${roomReservationId?.RoomStatus}`);
        res.redirect("/reservation-list");
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/delete/:EmailAddress", async function (req, res, next) {
    try {
        let UserType = (0, Util_1.UserSecurityLevel)(req);
        let emailAddress = req.params.EmailAddress;
        await reservation_1.default.deleteOne({ EmailAddress: emailAddress });
        if (UserType === "employee") {
            res.redirect("/reservation-list");
        }
        else if (UserType === "guest") {
            res.redirect("/guest-reservation");
        }
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
            userType: (0, Util_1.UserSecurityLevel)(req),
            emailaddress: (0, Util_1.FindEmailAddress)(req),
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/reservation-edit/:EmailAddress", async (req, res, next) => {
    try {
        let UserType = (0, Util_1.UserSecurityLevel)(req);
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
        if (UserType === "employee") {
            res.redirect("/reservation-list");
        }
        else if (UserType === "guest") {
            res.redirect("/guest-reservation");
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map