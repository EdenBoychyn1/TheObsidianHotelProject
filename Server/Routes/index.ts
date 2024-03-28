import express from "express";
const router = express.Router();

import Reservation from "../Models/reservation";
import Guest from "../Models/guest";
import Room from "../Models/room";
import Employee from "../Models/user";
import mongoose from "mongoose";
import passport from "passport";

/* GET home page. */
router.get("/", function (req, res, next) {
  // let securityLevel = req.user ? req.user.SecurityLevel : "Guest"; // Assuming you're using Passport and the user is stored in req.user
  // let headerTemplate = securityLevel === "Employee" ? "employee-header" : "header";
  res.render("index", { title: "Home", page: "home", displayName: "" });
});

router.get("/home", function (req, res, next) {
  res.render("index", { title: "Home", page: "home", displayName: "" });
});

/* GET about page */
router.get("/about", function (req, res, next) {
  res.render("index", { title: "About Us", page: "about", displayName: "" });
});

/* GET gallery page */
router.get("/gallery", function (req, res, next) {
  res.render("index", { title: "Gallery", page: "gallery", displayName: "" });
});

/* GET Rooms page */
router.get("/rooms", function (req, res, next) {
  res.render("index", { title: "Room", page: "rooms", displayName: "" });
});

/* GET login page */
router.get("/login", function (req, res, next) {
  res.render("index", {
    title: "Login",
    page: "login",
    displayName: "",
    messages: "",
  });
});

router.get("/guest-login", function (req, res, next) {
  res.render("index", {
    title: "Login",
    page: "login",
    displayName: "",
    messages: "",
  });
});

router.post("/guest-login", async (req, res, next) => {
  let Username = req.body.username;
  let Password = req.body.password;

  try {
    const loggedInGuest = await Guest.findOne({
      $and: [{ EmailAddress: Username }, { ConfirmPassword: Password }],
    }).exec();

    if (loggedInGuest) {
      // User found, redirect to about page
      res.redirect("/");
    } else {
      // User not found or incorrect credentials
      res.redirect("/guest-login");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error"); // Handle the error gracefully
  }
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
  passport.authenticate("local", function (err: any, user: any, info: any) {
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

      if (user.SecurityLevel === "Guest") {
        res.redirect("/");
      } else {
        res.redirect("/reservation-list");
      }
    });
  })(req, res, next);
});

router.get("/about", (req, res) => {
  // Access session data
  // Render your template with the session data
  res.render("/index", {
    title: "About Us",
    page: "about",
    displayName: "",
  });
});

/* GET Reservation page */
router.get("/reservation", function (req, res, next) {
  res.render("index", {
    title: "Reservations",
    page: "reservation",
    displayName: "",
  });
});

/* GET Employee Register page */
router.get("/employee-register", function (req, res, next) {
  console.log("Hello");
  res.render("index", {
    title: "Employee Registration ",
    page: "employee-register",
    displayName: "",
    messages: "",
  });
});

router.post(
  "/employee-register",
  function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    // Instantiate a new user object
    // We have to do this because we do not have access to the user model
    let newEmployee = new Employee({
      // Why lowercase username and why is everything else uppercase;
      FirstName: req.body.firstName,
      LastName: req.body.lastName,
      username: req.body.emailAddress,
      SecurityLevel: "FrontDeskAgent",
      EmailAddress: req.body.emailAddress,
    });

    Employee.register(newEmployee, req.body.password, function (err: any) {
      if (err) {
        if (err.name == "UserExistsError") {
          console.error("ERROR: User already exists!");
          req.flash("registerMessage", "Registration Error");
        } else {
          console.error(err.name); // Other error
          req.flash("registerMessage", "Server Error");
        }

        return res.redirect("/employee-register");
      }

      return res.redirect("/reservation-list");
    });
  }
);

/* GET Guest Register page */
router.get("/register", function (req, res, next) {
  res.render("index", {
    title: "Guest Registration ",
    page: "register",
    displayName: "",
  });
});

router.post("/register", async (req, res, next) => {
  {
    let address = req.body.inputAddress;
    let addressSplit = address.split(" ");
    let streetNumber = addressSplit[0];
    let streetName = addressSplit[1];

    for (let i = 2; i < addressSplit.length; i++) {
      streetName += " " + addressSplit[i];
    }
    // Instantiate a new user object
    // We have to do this because we do not have access to the user model
    let newGuest = new Guest({
      // Why lowercase username and why is everything else uppercase;
      // Why lowercase username and why is everything else uppercase;
      FirstName: req.body.firstName,
      LastName: req.body.lastName,
      username: req.body.emailAddress,
      SecurityLevel: "Guest",
      ConfirmPassword: req.body.confirmPassword,
      EmailAddress: req.body.emailAddress,
      UnitNumber: req.body.inputUnitNumber,
      StreetNumber: streetNumber,
      StreetName: streetName,
      City: req.body.inputCity,
      Province: req.body.inputProvince,
      Country: req.body.inputCountry,
      PostalCode: req.body.inputPostalCode,
    });

    Guest.register(newGuest, req.body.password, function (err: any) {
      if (err) {
        if (err.name == "UserExistsError") {
          console.error("ERROR: User already exists!");
          req.flash("registerMessage", "Registration Error");
        } else {
          console.error(err.name); // Other error
          req.flash("registerMessage", "Server Error");
        }

        return res.redirect("/register");
      }

      return res.redirect("/");

      // return passport.authenticate("local")(req, res, function () {
      //   console.log("in auth function");

      //   return res.redirect("/reservation-list");
      // });
    });
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
// router.post("/reservation-add", async function (req, res, next) {
//   try {
//     let firstName = req.body.inputReservationFirstName;
//     let lastName = req.body.inputReservationLastName;
//     let unitNumber = req.body.inputUnitNumber;
//     let city = req.body.inputCity;
//     let province = req.body.inputProvince;
//     let country = req.body.inputCountry;
//     let postalCode = req.body.inputPostalCode;
//     let reservationStartDate = req.body.inputCheckInDate;
//     let reservationEndDate = req.body.inputCheckOutDate;
//     let numberOfGuests = req.body.inputPax;
//     let roomType = req.body.inputRoomType;
//     let reservationId = req.body.inputReservationLastName + Date.now();
//     let emailAddress = req.body.inputEmailAddress;
//     let address = req.body.inputAddress;
//     let addressSplit = address.split(" ");
//     let streetNumber = addressSplit[0];
//     let streetName = addressSplit[1];

//     for (let i = 2; i < addressSplit.length; i++) {
//       streetName += " " + addressSplit[i];
//     }

//     const roomCollection = await Room.find({ RoomType: roomType }).exec();

//     console.log(`Country ${country}`);
//     for (let index = 0; index < roomCollection.length; index++) {
//       console.log(`Index: ${index + 1}, \n ${roomCollection[index]}`);
//       const documentsReservationStartDate =
//         roomCollection[index].ReservationStartDate;
//       const documentsReservationEndDate =
//         roomCollection[index].ReservationEndDate;
//       const documentsRoomNumber = roomCollection[index].RoomNumber;
//       const documentsRoomDescription = roomCollection[index].RoomDescription;
//       const documentsRoomPrice = roomCollection[index].RoomPrice;
//       const documentsRoomAccessible = roomCollection[index].RoomAccessible;

//       console.log(`Room Collection  ${roomCollection[index].RoomNumber}`);

//       if (documentsReservationStartDate && documentsReservationEndDate) {
//         if (
//           (reservationStartDate <= documentsReservationEndDate &&
//             reservationEndDate >= documentsReservationStartDate) ||
//           (documentsReservationStartDate <= reservationEndDate &&
//             documentsReservationEndDate >= reservationStartDate)
//         ) {
//           console.log("Cannot Make Booking1");
//         } else if (
//           reservationStartDate === documentsReservationStartDate ||
//           reservationEndDate === documentsReservationEndDate ||
//           (reservationStartDate === documentsReservationStartDate &&
//             reservationEndDate === documentsReservationEndDate) ||
//           (reservationStartDate >= documentsReservationStartDate &&
//             reservationEndDate <= documentsReservationEndDate)
//         ) {
//           console.log("Cannot Make Booking2");
//         } else {
//           let newReservation = new Reservation({
//             ReservationID: reservationId,
//             ReservationStartDate: reservationStartDate,
//             ReservationEndDate: reservationEndDate,
//             NumberOfGuests: numberOfGuests,
//             RoomNumber: documentsRoomNumber,
//             BillingUnitNumber: unitNumber,
//             BillingStreetNumber: streetNumber,
//             BillingStreetName: streetName,
//             BillingCity: city,
//             BillingProvince: province,
//             BillingCountry: country,
//             BillingPostalCode: postalCode,
//             EmailAddress: emailAddress,
//           });

//           let newGuest = new Guest({
//             FirstName: firstName,
//             LastName: lastName,
//             UserName: "",
//             SecurityLevel: "Guest",
//             EmailAddress: emailAddress,
//             Password: "",
//             UnitNumber: unitNumber,
//             StreetNumber: streetNumber,
//             StreetName: streetName,
//             City: city,
//             Province: province,
//             Country: country,
//             PostalCode: postalCode,
//             DateCreated: Date.now(),
//             LastUpdate: Date.now(),
//           });

//           let newRoomReservation = new Room({
//             RoomNumber: documentsRoomNumber,
//             ReservationStartDate: reservationStartDate,
//             ReservationEndDate: reservationEndDate,
//             RoomDescription: documentsRoomDescription,
//             RoomType: roomType,
//             RoomPrice: documentsRoomPrice,
//             RoomStatus: "Reserved",
//             RoomAccessible: documentsRoomAccessible,
//             ReservationID: reservationId,
//           });
//           await newGuest.save();
//           await newReservation.save();
//           await newRoomReservation.save();

//           break;
//         }
//       }
//     }

//     res.redirect("/reservation-list");
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

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

    /**
     * Finding specific rooms by room type
     * @type {*} */
    const roomCollection = await Room.find({
      RoomType: roomType,
    }).exec();

    let conflictFound = false;
    /**
     *  Looping through rooms array
     */
    for (let index = 0; index < roomCollection.length; index++) {
      const reservation = await Reservation.find({
        RoomNumber: roomCollection[index].RoomNumber,
      });

      for (let j = 0; j < reservation.length; j++) {
        const documentsReservationStartDate =
          reservation[j].ReservationStartDate;
        const documentsReservationEndDate = reservation[j].ReservationEndDate;

        console.log(
          `Proposed Reservation Start Date: ${reservationStartDate}, Reservation Start Date of already Created Reservation ${documentsReservationStartDate}`
        );

        if (reservationStartDate === documentsReservationStartDate) {
          console.log("Reservation conflicts with an existing reservation");
          conflictFound = true;
          break; // Exit the inner loop since conflict is found
        }
      }

      if (conflictFound) {
        console.log(`Conflict Found ${conflictFound}`);
        break;
      }
    }

    if (!conflictFound) {
      // If no conflict is found, proceed with creating the new reservation
      let newReservation = new Reservation({
        ReservationID: reservationId,
        ReservationStartDate: reservationStartDate,
        ReservationEndDate: reservationEndDate,
        NumberOfGuests: numberOfGuests,
        RoomNumber: "",
        RoomType: roomType,
        BillingUnitNumber: unitNumber,
        BillingStreetNumber: streetNumber,
        BillingStreetName: streetName,
        BillingCity: city,
        BillingProvince: province,
        BillingCountry: country,
        BillingPostalCode: postalCode,
        EmailAddress: emailAddress,
      });

      // Save the new reservation
      await newReservation.save();
      res.redirect("/reservation-list");
    }
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
