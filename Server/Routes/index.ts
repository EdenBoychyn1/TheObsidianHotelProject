import express from "express";
const router = express.Router();

import Reservation from "../Models/reservation";
import Guest from "../Models/guest";
import Room from "../Models/room";
import Employee from "../Models/user";
import mongoose from "mongoose";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Home", page: "home" });
});

router.get("/home", function (req, res, next) {
  res.render("index", { title: "Home", page: "home" });
});

/* GET about page */
router.get("/about", function (req, res, next) {
  res.render("index", { title: "About Us", page: "about" });
});

/* GET gallery page */
router.get("/gallery", function (req, res, next) {
  res.render("index", { title: "Gallery", page: "gallery" });
});

/* GET Rooms page */
router.get("/rooms", function (req, res, next) {
  res.render("index", { title: "Room", page: "rooms" });
});

/* GET login page */
router.get("/login", function (req, res, next) {
  let username = req.body.userName;
  let password = req.body.password;

  console.log(username, password);
  res.render("index", {
    title: "Login",
    page: "login",
  });
});

/* GET login page */
router.post("/login", async function (req, res, next) {
  try {
    let username = req.body.userName;
    let password = req.body.password;

    // Find a single user matching the username and password
    const user = await Employee.findOne({
      UserName: username,
      Password: password,
    }).exec();

    if (user) {
      // User found, redirect to about page
      res.redirect("/about");
    } else {
      // User not found or incorrect credentials
      res.status(401).send("Invalid username or password");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error"); // Handle the error gracefully
  }
});

router.get("/about", (req, res) => {
  // Access session data
  // Render your template with the session data
  res.render("/index", {
    title: "About Us",
    page: "about",
  });
});

/* GET Reservation page */
router.get("/reservation", function (req, res, next) {
  res.render("index", { title: "Reservations", page: "reservation" });
});

/* GET Employee Register page */
router.get("/employee-register", function (req, res, next) {
  console.log("Hello");
  res.render("index", {
    title: "Employee Registration ",
    page: "employee-register",
  });
});

router.post("/employee-register", async (req, res, next) => {
  try {
    // let hashedPassword = window.btoa(req.body.password);

    let newEmployee = new Employee({
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
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

/* GET Guest Register page */
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

    let newGuest = new Guest({
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
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/reservation-list", async (req, res, next) => {
  try {
    const reservationsCollection = await Reservation.find({}).exec();
    res.render("index", {
      title: "Reservation List",
      page: "reservation-list",
      displayName: "",
      reservations: reservationsCollection,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error"); // Handle the error gracefully
  }
});

/* Display the Add Page */
router.get("/reservation-add", function (req, res, next) {
  res.render("index", {
    title: "Add",
    page: "reservation-add",
    reservation: "",
    displayName: "",
  });
});

/* Process the Add Page */
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

    const roomCollection = await Room.find({ RoomType: roomType }).exec();

    console.log(`Country ${country}`);
    for (let index = 0; index < roomCollection.length; index++) {
      console.log(`Index: ${index + 1}, \n ${roomCollection[index]}`);
      const documentsReservationStartDate =
        roomCollection[index].ReservationStartDate;
      const documentsReservationEndDate =
        roomCollection[index].ReservationEndDate;
      const documentsRoomNumber = roomCollection[index].RoomNumber;
      const documentsRoomDescription = roomCollection[index].RoomDescription;
      const documentsRoomPrice = roomCollection[index].RoomPrice;
      const documentsRoomAccessible = roomCollection[index].RoomAccessible;

      if (documentsReservationStartDate && documentsReservationEndDate) {
        if (
          (reservationStartDate <= documentsReservationEndDate &&
            reservationEndDate >= documentsReservationStartDate) ||
          (documentsReservationStartDate <= reservationEndDate &&
            documentsReservationEndDate >= reservationStartDate)
        ) {
          console.log("Cannot Make Booking1");
        } else if (
          reservationStartDate === documentsReservationStartDate ||
          reservationEndDate === documentsReservationEndDate ||
          (reservationStartDate === documentsReservationStartDate &&
            reservationEndDate === documentsReservationEndDate) ||
          (reservationStartDate >= documentsReservationStartDate &&
            reservationEndDate <= documentsReservationEndDate)
        ) {
          console.log("Cannot Make Booking2");
        } else {
          let newReservation = new Reservation({
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

          let newGuest = new Guest({
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

          let newRoomReservation = new Room({
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
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/check-in/:ReservationID", async function (req, res, next) {
  try {
    let reservationId = req.params.ReservationID;

    // Define a variable to store the combined data
    const roomReservationId = await Room.findOneAndUpdate(
      { ReservationID: reservationId },
      { $set: { RoomStatus: "CheckedIn" } }
    ).exec();

    console.log(
      `ReservationID: ${roomReservationId?.ReservationID}, Room Status: ${roomReservationId?.RoomStatus}`
    );

    res.redirect("/reservation-list");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/check-out/:ReservationID", async function (req, res, next) {
  try {
    let reservationId = req.params.ReservationID;

    // Define a variable to store the combined data
    const roomReservationId = await Room.findOneAndUpdate(
      { ReservationID: reservationId },
      { $set: { RoomStatus: "CheckedOut" } }
    ).exec();

    console.log(
      `ReservationID: ${roomReservationId?.ReservationID}, Room Status: ${roomReservationId?.RoomStatus}`
    );

    res.redirect("/reservation-list");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// My Code that I spent 2 hours wondering why my delete middleware method wasn't working.
router.get("/delete/:EmailAddress", async function (req, res, next) {
  try {
    let emailAddress = req.params.EmailAddress;

    await Reservation.deleteOne({ EmailAddress: emailAddress });

    res.redirect("/reservation-list");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/reservation-edit/:EmailAddress", async (req, res, next) => {
  let emailAddress = req.params.EmailAddress;

  try {
    // Define a variable to store the combined data
    const reservation = await Reservation.aggregate([
      {
        $match: { EmailAddress: emailAddress }, // Match the reservation by EmailAddress
      },
      {
        $lookup: {
          from: "guests", // The collection you're looking up into (Guest collection)
          localField: "EmailAddress", // Field from Reservation collection
          foreignField: "EmailAddress", // Field from Guest collection
          as: "guest", // Alias for the joined documents
        },
      },
    ]).exec();

    return res.render("index", {
      title: "Edit",
      page: "reservation-edit",
      reservation: reservation,
      displayName: "",
    });

    // Now you can use `combinedData` for further processing or return it as needed
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/* Display the Edit Page with Data injected from the db */
router.post("/reservation-edit/:EmailAddress", async (req, res, next) => {
  console.log("Hello");

  //instantiate a new contact to edit
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
    let updatedReservation = await Reservation.findOneAndUpdate(
      { EmailAddress: emailAddress },
      {
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
      }
    ).exec();
    console.log(`Billing Province ${updatedReservation?.BillingProvince}`);
    res.redirect("/reservation-list");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});
export default router;
