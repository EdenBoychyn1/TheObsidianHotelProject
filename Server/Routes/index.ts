import express from "express";
const router = express.Router();

import Reservation from "../Models/reservation";
// import accompaniedGuest from "../Models/accompaniedguest";
import Room from "../Models/room";
import { User, Guest } from "../Models/user";
import mongoose from "mongoose";
import passport from "passport";
import { FindEmailAddress, UserSecurityLevel } from "../Util";

/* GET home page. */
router.get("/", function (req, res, next) {
  // let securityLevel = req.user ? req.session : "Guest"; // Assuming you're using Passport and the user is stored in req.user
  // let headerTemplate = securityLevel === "Employee" ? "employee-header" : "header";
  res.render("index", {
    title: "Home",
    page: "home",
    userType: UserSecurityLevel(req),
    emailaddress: FindEmailAddress(req),
  });
});

router.get("/home", function (req, res, next) {
  res.render("index", {
    title: "Home",
    page: "home",
    userType: UserSecurityLevel(req),
    emailaddress: FindEmailAddress(req),
  });
});

/* GET gallery page */
router.get("/gallery", function (req, res, next) {
  res.render("index", {
    title: "Gallery",
    page: "gallery",
    userType: UserSecurityLevel(req),
    emailaddress: FindEmailAddress(req),
  });
});

/* GET Rooms page */
router.get("/rooms", function (req, res, next) {
  res.render("index", {
    title: "Room",
    page: "rooms",
    userType: UserSecurityLevel(req),
    emailaddress: FindEmailAddress(req),
  });
});

/* GET login page */
router.get("/login", function (req, res, next) {
  if (!req.user) {
    res.render("index", {
      title: "Login",
      page: "login",
      userType: "",
      messages: req.flash("loginMessage"),
      emailaddress: FindEmailAddress(req),
    });
  }

  return res.redirect("/");
});

// router.get("/guest-login", function (req, res, next) {
//   res.render("index", {
//     title: "Login",
//     page: "login",
//     userType: "",
//     messages: "",
//   });
// });

// router.post("/guest-login", async (req, res, next) => {
//   let Username = req.body.username;
//   let Password = req.body.password;

//   try {
//     const loggedInGuest = await Guest.findOne({
//       $and: [{ EmailAddress: Username }, { ConfirmPassword: Password }],
//     }).exec();

//     if (loggedInGuest) {
//       // User found, redirect to about page
//       res.redirect("/");
//     } else {
//       // User not found or incorrect credentials
//       res.redirect("/guest-login");
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error"); // Handle the error gracefully
//   }
// });

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

      // if (user.userType === "Guest") {
      //   res.redirect("/");
      // } else if (user.userType === "employee") {
      //   res.redirect("/reservation-list");
      // }

      const userType = user.userType;
      res.render("index", {
        title: "Home",
        page: "home",
        userType: userType,
        emailaddress: FindEmailAddress(req),
      });
    });
  })(req, res, next);
});

/* GET Reservation page */
router.get("/reservation", function (req, res, next) {
  res.render("index", {
    title: "Reservations",
    page: "reservation",
    userType: UserSecurityLevel(req),
    emailaddress: FindEmailAddress(req),
  });
});

/* GET Employee Register page */
router.get("/employee-register", function (req, res, next) {
  if (req.user) {
    res.render("index", {
      title: "Employee Registration",
      page: "employee-register",
      userType: UserSecurityLevel(req),
      messages: req.flash("registerMessage"),
      emailaddress: FindEmailAddress(req),
    });
  }
  return res.redirect("/");
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
    console.log("Hello");
    let newEmployee = new User({
      // Why lowercase username and why is everything else uppercase;
      FirstName: req.body.firstName,
      LastName: req.body.lastName,
      username: req.body.emailAddress,
      SecurityLevel: "FrontDeskAgent",
      EmailAddress: req.body.emailAddress,
      userType: "employee",
    });
    console.log("Hello1");
    User.register(newEmployee, req.body.password, function (err: any) {
      if (err) {
        console.log("Hello2");
        if (err.name == "UserExistsError") {
          console.error("ERROR: User already exists!");
          req.flash("registerMessage", "Registration Error");
        } else {
          console.error(err.name); // Other error
          req.flash("registerMessage", "Server Error");
        }
        console.log("Hello3");
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
    userType: UserSecurityLevel(req),
    messages: "",
    emailaddress: FindEmailAddress(req),
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
      // Instantiate a new user object
      // We have to do this because we do not have access to the user model
      let newGuest = new Guest({
        // Why lowercase username and why is everything else uppercase;

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

      await User.register(newGuest, req.body.password);
      // {
      //   if (err) {
      //     if (err.name == "UserExistsError") {
      //       console.error("ERROR: User already exists!");
      //       req.flash("registerMessage", "Registration Error");
      //     } else {
      //       console.error(err.name); // Other error
      //       req.flash("registerMessage", "Server Error");
      //     }

      //     return res.redirect("/register");
      //   }

      //   return res.redirect("/");

      //   // return passport.authenticate("local")(req, res, function () {
      //   //   console.log("in auth function");

      //   //   return res.redirect("/reservation-list");
      //   // });
      // // });
      return res.redirect("/");
    } catch (error) {
      console.error("Error registering guest:", error);
      req.flash("registerMessage", "Server Error");
      return res.redirect("/register");
    }
  }
});

router.get("/reservation-list", async (req, res, next) => {
  try {
    if (req.user) {
      const reservationsCollection = await Reservation.find({}).exec();

      // Render the page with the reservations data
      res.render("index", {
        title: "Reservation List",
        page: "reservation-list",
        userType: UserSecurityLevel(req),
        reservations: reservationsCollection,
        emailaddress: FindEmailAddress(req),
      });
    } else {
      return res.redirect("/");
    }
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
    userType: UserSecurityLevel(req),
    emailaddress: FindEmailAddress(req),
  });
});

/* Process the Add Page */
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

    /**
     * Finding specific rooms by room type
     * @type {*} */
    const roomCollection = await Room.find({
      RoomType: roomType,
    }).exec();

    let conflictFound = false;

    let newRoomNumber;
    /**
     *  Looping through rooms array
     */
    for (let index = 0; index < roomCollection.length; index++) {
      console.log(`Room Number: ${roomCollection[index].RoomNumber}`);

      const reservation = await Reservation.find({
        RoomNumber: roomCollection[index].RoomNumber,
      });

      console.log(`Room Collection Length ${roomCollection.length}`);

      for (let j = 0; j < reservation.length; j++) {
        const documentsReservationStartDate =
          reservation[j].ReservationStartDate;
        const documentsReservationEndDate = reservation[j].ReservationEndDate;

        console.log(
          `Proposed Reservation Start Date: ${reservationStartDate}, Reservation Start Date of already Created Reservation ${documentsReservationStartDate}`
        );

        console.log(`Reservation Length ${reservation.length}`);
        console.log(`Reservation: ${reservation[index]}`);
        if (
          reservationStartDate === documentsReservationStartDate ||
          reservationEndDate === documentsReservationEndDate
        ) {
          console.log("Reservation conflicts with an existing reservation");
          conflictFound = true;
        }
      }

      if (conflictFound) {
        console.log(`Conflict Found ${conflictFound}`);
        // break;
      } else {
        newRoomNumber = roomCollection[index].RoomNumber;
      }
    }

    if (!conflictFound) {
      // If no conflict is found, proceed with creating the new reservation
      let newReservation = new Reservation({
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

      // Save the new reservation
      await newReservation.save();
    }

    res.redirect("/");
  } catch (error) {
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

    /**
     * Finding specific rooms by room type
     * @type {*} */
    const roomCollection = await Room.find({
      RoomType: roomType,
    }).exec();

    let conflictFound = false;

    let newRoomNumber;
    /**
     *  Looping through rooms array
     */
    for (let index = 0; index < roomCollection.length; index++) {
      console.log(`Room Number: ${roomCollection[index].RoomNumber}`);

      const reservation = await Reservation.find({
        RoomNumber: roomCollection[index].RoomNumber,
      });

      console.log(`Room Collection Length ${roomCollection.length}`);

      for (let j = 0; j < reservation.length; j++) {
        const documentsReservationStartDate =
          reservation[j].ReservationStartDate;
        const documentsReservationEndDate = reservation[j].ReservationEndDate;

        console.log(
          `Proposed Reservation Start Date: ${reservationStartDate}, Reservation Start Date of already Created Reservation ${documentsReservationStartDate}`
        );

        console.log(`Reservation Length ${reservation.length}`);
        console.log(`Reservation: ${reservation[index]}`);
        if (
          reservationStartDate === documentsReservationStartDate ||
          reservationEndDate === documentsReservationEndDate
        ) {
          console.log("Reservation conflicts with an existing reservation");
          conflictFound = true;
        }
      }

      if (conflictFound) {
        console.log(`Conflict Found ${conflictFound}`);
        // break;
      } else {
        newRoomNumber = roomCollection[index].RoomNumber;
      }
    }

    if (!conflictFound) {
      // If no conflict is found, proceed with creating the new reservation
      let newReservation = new Reservation({
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

      // Save the new reservation
      await newReservation.save();
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
    const roomReservationId = await Reservation.findOneAndUpdate(
      { ReservationID: reservationId },
      { $set: { RoomStatus: "Checked In" } }
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
    const roomReservationId = await Reservation.findOneAndUpdate(
      { ReservationID: reservationId },
      { $set: { RoomStatus: "Checked Out" } }
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
      userType: UserSecurityLevel(req),
      emailaddress: FindEmailAddress(req),
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
