"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const reservation_1 = __importDefault(require("../Models/reservation"));
const guest_1 = __importDefault(require("../Models/guest"));
const room_1 = __importDefault(require("../Models/room"));
const user_1 = __importDefault(require("../Models/user"));
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
router.post("/login", async function (req, res, next) {
    try {
        let username = req.body.userName;
        let password = req.body.password;
        const user = await user_1.default.findOne({
            UserName: username,
            Password: password,
        }).exec();
        if (user) {
            res.redirect("/about");
        }
        else {
            res.status(401).send("Invalid username or password");
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
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
router.get("/reservation-add", function (req, res, next) {
    res.render("index", {
        title: "Add",
        page: "reservation-add",
        reservation: "",
        displayName: "",
    });
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
        const roomCollection = await room_1.default.find({ RoomType: roomType }).exec();
        console.log(`Country ${country}`);
        for (let index = 0; index < roomCollection.length; index++) {
            console.log(`Index: ${index + 1}, \n ${roomCollection[index]}`);
            const documentsReservationStartDate = roomCollection[index].ReservationStartDate;
            const documentsReservationEndDate = roomCollection[index].ReservationEndDate;
            const documentsRoomNumber = roomCollection[index].RoomNumber;
            const documentsRoomDescription = roomCollection[index].RoomDescription;
            const documentsRoomPrice = roomCollection[index].RoomPrice;
            const documentsRoomAccessible = roomCollection[index].RoomAccessible;
            if (documentsReservationStartDate && documentsReservationEndDate) {
                if ((reservationStartDate <= documentsReservationEndDate &&
                    reservationEndDate >= documentsReservationStartDate) ||
                    (documentsReservationStartDate <= reservationEndDate &&
                        documentsReservationEndDate >= reservationStartDate)) {
                    console.log("Cannot Make Booking1");
                }
                else if (reservationStartDate === documentsReservationStartDate ||
                    reservationEndDate === documentsReservationEndDate ||
                    (reservationStartDate === documentsReservationStartDate &&
                        reservationEndDate === documentsReservationEndDate) ||
                    (reservationStartDate >= documentsReservationStartDate &&
                        reservationEndDate <= documentsReservationEndDate)) {
                    console.log("Cannot Make Booking2");
                }
                else {
                    let newReservation = new reservation_1.default({
                        ReservationID: reservationId,
                        ReservationStartDate: reservationStartDate,
                        ReservationEndDate: reservationEndDate,
                        NumberOfGuests: numberOfGuests,
                        RoomNumber: documentsRoomNumber,
                        BillingUnitNumber: unitNumber,
                        BillingStreetNumber: streetNumber,
                        BillingStreetName: streetName,
                        BillingCity: city,
                        BillingProvince: province,
                        BillingCountry: country,
                        BillingPostalCode: postalCode,
                        EmailAddress: emailAddress,
                    });
                    let newGuest = new guest_1.default({
                        FirstName: firstName,
                        LastName: lastName,
                        UserName: "",
                        SecurityLevel: "Guest",
                        EmailAddress: emailAddress,
                        Password: "",
                        UnitNumber: unitNumber,
                        StreetNumber: streetNumber,
                        StreetName: streetName,
                        City: city,
                        Province: province,
                        Country: country,
                        PostalCode: postalCode,
                        DateCreated: Date.now(),
                        LastUpdate: Date.now(),
                    });
                    let newRoomReservation = new room_1.default({
                        RoomNumber: documentsRoomNumber,
                        ReservationStartDate: reservationStartDate,
                        ReservationEndDate: reservationEndDate,
                        RoomDescription: documentsRoomDescription,
                        RoomType: roomType,
                        RoomPrice: documentsRoomPrice,
                        RoomStatus: "Reserved",
                        RoomAccessible: documentsRoomAccessible,
                        ReservationID: reservationId,
                    });
                    await newGuest.save();
                    await newReservation.save();
                    await newRoomReservation.save();
                    break;
                }
            }
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
        const roomReservationId = await room_1.default.findOneAndUpdate({ ReservationID: reservationId }, { $set: { RoomStatus: "CheckedIn" } }).exec();
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
        const roomReservationId = await room_1.default.findOneAndUpdate({ ReservationID: reservationId }, { $set: { RoomStatus: "CheckedOut" } }).exec();
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