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
router.get("/rooms", function (req, res, next) {
    res.render("index", {
        title: "Room",
        page: "rooms",
        userType: (0, Util_1.UserSecurityLevel)(req),
        emailaddress: (0, Util_1.FindEmailAddress)(req),
    });
});
router.get("/reservation", function (req, res, next) {
    res.render("index", {
        title: "Reservations",
        page: "reservation",
        userType: (0, Util_1.UserSecurityLevel)(req),
        emailaddress: (0, Util_1.FindEmailAddress)(req),
        messages: req.flash("registerMessage"),
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
router.get("/login", function (req, res, next) {
    res.render("index", {
        title: "Login",
        page: "login",
        userType: "",
        messages: req.flash("loginMessage"),
        emailaddress: "",
    });
});
router.post("/login", function (req, res, next) {
    passport_1.default.authenticate("local", function (err, user, info) {
        if (err) {
            console.error(err);
            res.end(err);
        }
        if (!user) {
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
            return res.redirect("/");
        });
    })(req, res, next);
});
router.get("/logout", function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        return res.redirect("/login");
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
    let newEmployee = new user_1.User({
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        username: req.body.emailAddress,
        SecurityLevel: "FrontDeskAgent",
        EmailAddress: req.body.emailAddress,
        userType: "employee",
    });
    user_1.User.register(newEmployee, req.body.password, function (err) {
        if (err) {
            if (err.name == "UserExistsError") {
                console.error("ERROR: User already exists!\n");
                req.flash("registerMessage", "ERROR: this Employee already exists!");
            }
            else if (err.name == "MissingUsernameError") {
                console.error("ERROR: User must enter an email address!\n");
                req.flash("registerMessage", "ERROR: You must enter an email address for the employee!");
            }
            else if (err.name == "MissingPasswordError") {
                console.error("ERROR: User must enter a password!\n");
                req.flash("registerMessage", "ERROR: You must enter a temporary password for the employee!");
            }
            else {
                console.error(err.name);
                req.flash("registerMessage", "Server Error: Missing or incorrect information.");
            }
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
        messages: req.flash("registerMessage"),
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
            user_1.User.register(newGuest, req.body.password, function (err) {
                if (err) {
                    if (err.name == "UserExistsError") {
                        console.error("ERROR: Guest already exists!\n");
                        req.flash("registerMessage", "ERROR: this Employee already exists!");
                    }
                    else if (err.name == "MissingUsernameError") {
                        console.error("ERROR: User must enter an email address!\n");
                        req.flash("registerMessage", "ERROR: You must enter an email address for the guests!");
                    }
                    else if (err.name == "MissingPasswordError") {
                        console.error("ERROR: User must enter a password!\n");
                        req.flash("registerMessage", "ERROR: You must enter a password!");
                    }
                    else {
                        console.error(err.name);
                        req.flash("registerMessage", "Server Error: Missing or incorrect information.");
                    }
                    return res.redirect("/register");
                }
                return res.render("index", {
                    title: "Home",
                    page: "home",
                    userType: (0, Util_1.UserSecurityLevel)(req),
                    emailaddress: (0, Util_1.FindEmailAddress)(req),
                });
            });
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
        messages: req.flash("registerMessage"),
    });
});
router.post("/reservation", async function (req, res, next) {
    try {
        let UserType = (0, Util_1.UserSecurityLevel)(req);
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
        if (firstName === "" ||
            lastName === "" ||
            city === "" ||
            province === "" ||
            country === "" ||
            postalCode === "" ||
            reservationStartDate === "" ||
            reservationEndDate === "" ||
            numberOfGuests === "" ||
            roomType === "" ||
            emailAddress === "" ||
            address === "") {
            req.flash("registerMessage", "ERROR: Missing or incorrect information.");
            return res.redirect("/reservation");
        }
        else if (reservationStartDate >= reservationEndDate ||
            reservationEndDate <= reservationStartDate) {
            req.flash("registerMessage", "ERROR: Check In Date cannot be later than Check Out Date and Check Out Date cannot be earlier than Check In Date.");
            return res.redirect("/reservation");
        }
        else {
            for (let index = 0; index < roomCollection.length; index++) {
                console.log(`Room Number: ${roomCollection[index].RoomNumber}`);
                const reservation = await reservation_1.default.find({
                    RoomNumber: roomCollection[index].RoomNumber,
                });
                let conflictFound = false;
                for (let i = 0; i < reservation.length; i++) {
                    const existingReservation = reservation[i];
                    console.log(`Reservation Start Date: ${existingReservation.ReservationStartDate}`);
                    if ((reservationStartDate >= existingReservation.ReservationStartDate &&
                        reservationStartDate < existingReservation.ReservationEndDate) ||
                        (reservationEndDate > existingReservation.ReservationStartDate &&
                            reservationEndDate <= existingReservation.ReservationEndDate) ||
                        (reservationStartDate <= existingReservation.ReservationStartDate &&
                            reservationEndDate >= existingReservation.ReservationEndDate)) {
                        console.log("Conflict found!");
                        conflictFound = true;
                        break;
                    }
                }
                if (conflictFound === false) {
                    let newReservation = new reservation_1.default({
                        ReservationID: reservationId,
                        GuestFirstName: firstName,
                        GuestLastName: lastName,
                        ReservationStartDate: reservationStartDate,
                        ReservationEndDate: reservationEndDate,
                        NumberOfGuests: numberOfGuests,
                        RoomNumber: roomCollection[index].RoomNumber,
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
                    if (UserType === "employee") {
                        return res.redirect("/reservation-list");
                    }
                    else if (UserType === "guest") {
                        return res.redirect("/guest-reservation");
                    }
                }
                else if (conflictFound === true) {
                    req.flash("registerMessage", "ERROR: No rooms for the room type selected are available for the dates that you have entered.");
                    return res.redirect("/reservation");
                }
            }
        }
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
        if (firstName === "" ||
            lastName === "" ||
            city === "" ||
            province === "" ||
            country === "" ||
            postalCode === "" ||
            reservationStartDate === "" ||
            reservationEndDate === "" ||
            numberOfGuests === "" ||
            roomType === "" ||
            emailAddress === "" ||
            address === "") {
            req.flash("registerMessage", "ERROR: Missing or incorrect information.");
            return res.redirect("/reservation");
        }
        else if (reservationStartDate >= reservationEndDate ||
            reservationEndDate <= reservationStartDate) {
            req.flash("registerMessage", "ERROR: Check In Date cannot be later than Check Out Date and Check Out Date cannot be earlier than Check In Date.");
            return res.redirect("/reservation");
        }
        else {
            for (let index = 0; index < roomCollection.length; index++) {
                console.log(`Room Number: ${roomCollection[index].RoomNumber}`);
                const reservation = await reservation_1.default.find({
                    RoomNumber: roomCollection[index].RoomNumber,
                });
                let conflictFound = false;
                for (let i = 0; i < reservation.length; i++) {
                    const existingReservation = reservation[i];
                    console.log(`Reservation Start Date: ${existingReservation.ReservationStartDate}`);
                    if ((reservationStartDate >= existingReservation.ReservationStartDate &&
                        reservationStartDate < existingReservation.ReservationEndDate) ||
                        (reservationEndDate > existingReservation.ReservationStartDate &&
                            reservationEndDate <= existingReservation.ReservationEndDate) ||
                        (reservationStartDate <= existingReservation.ReservationStartDate &&
                            reservationEndDate >= existingReservation.ReservationEndDate)) {
                        console.log("Conflict found!");
                        conflictFound = true;
                        break;
                    }
                }
                if (conflictFound === false) {
                    let newReservation = new reservation_1.default({
                        ReservationID: reservationId,
                        GuestFirstName: firstName,
                        GuestLastName: lastName,
                        ReservationStartDate: reservationStartDate,
                        ReservationEndDate: reservationEndDate,
                        NumberOfGuests: numberOfGuests,
                        RoomNumber: roomCollection[index].RoomNumber,
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
                    return res.redirect("/reservation-list");
                }
                else if (conflictFound === true) {
                    req.flash("registerMessage", "No rooms for the room type selected are available for the dates that you have entered.");
                    return res.redirect("/reservation-add");
                }
            }
        }
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
    try {
        if (req.user) {
            let emailAddress = req.params.EmailAddress;
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
                messages: req.flash("registerMessage"),
            });
        }
        else {
            return res.redirect("/login");
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/reservation-edit/:EmailAddress", async (req, res, next) => {
    try {
        let UserType = (0, Util_1.UserSecurityLevel)(req);
        let firstName = req.body.inputReservationFirstName;
        let lastName = req.body.inputReservationLastName;
        let emailAddress = req.params.EmailAddress;
        let reservationStartDate = req.body.inputCheckInDate;
        let reservationEndDate = req.body.inputCheckOutDate;
        let billingUnitNumber = req.body.inputUnitNumber;
        let billingCity = req.body.inputCity;
        let billingProvince = req.body.inputProvince;
        let billingCountry = req.body.inputCountry;
        let billingPostalCode = req.body.inputPostalCode;
        let numberOfGuests = req.body.inputPax;
        let roomType = req.body.inputRoomType;
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
                BillingCountry: billingCountry,
                BillingPostalCode: billingPostalCode,
                roomType: roomType,
                NumberOfGuests: numberOfGuests,
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