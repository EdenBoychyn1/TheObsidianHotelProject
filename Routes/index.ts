import express from "express";
const router = express.Router();

import Reservation from "../Models/reservation";
import Guest from "../Models/guest";
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
router.post("/login", function (req, res, next) {
  // res.render("index", {
  //   title: "Login",
  //   page: "login",
  // });
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
  res.render("index", {
    title: "Employee Registration ",
    page: "employee-register",
  });
});

/* GET Guest Register page */
router.get("/register", function (req, res, next) {
  res.render("index", {
    title: "Guest Registration ",
    page: "register",
  });
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
router.get("/add", function (req, res, next) {
  res.render("index", {
    title: "Add",
    page: "reservation-edit",
    reservation: "",
    displayName: "",
  });
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
  const emailAddress = req.params.EmailAddress;

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
    reservation.forEach((mergedDocument, index) => {
      console.log(`Merged Document ${index + 1}:`, mergedDocument);
      // Access fields from the merged document
      console.log(`Reservation ID:`, mergedDocument.ReservationID);
      console.log(`Guest First Name:`, mergedDocument.guest[0].FirstName);

      if (
        Array.isArray(mergedDocument.guest) &&
        mergedDocument.guest.length > 0
      ) {
        const firstGuest = mergedDocument.guest[0]; // Get the first object from the array
        if (firstGuest.FirstName) {
          console.log(`Guest First Name:`, firstGuest.FirstName);
        } else {
          console.log(`Guest First Name is not available`);
        }
      } else {
        console.log(`No guest information available`);
      }
      // Access more fields as needed
    });
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

/* Display the EditPage */
/* Display the Edit Page with Data injected from the db */
router.post("./reservation-edit/:EmailAddress/:id", async (req, res, next) => {
  try {
    let emailAddress = req.params.EmailAddress;
    let id = req.params.id;
    let address = req.body.inputAddress;
    let addressSplit = address.split(" ");
    let streetNumber = addressSplit[0];
    let streetName = addressSplit[1];
    for (let i = 2; i < addressSplit.length; i++) {
      streetName += " " + addressSplit[i];
    }
    // instantiate a new contact to edit
    let updatedReservation = new Reservation({
      _id: id,
      ReservationStartDate: req.body.inputCheckInDate,
      ReservationEndDate: req.body.inputCheckOutDate,
      NumberOfGuests: req.body.inputPax,
      RoomNumber: 1,
      BillingUnitNumber: req.body.inputUnitNumber,
      BillingStreetNumber: streetNumber,
      BillingStreetName: streetName,
      BillingCity: req.body.inputCity,
      BillingProvince: req.body.inputProvince,
      BillingCountry: req.body.inputCountry,
      BillingPostalCode: req.body.inputPostalCode,
      EmailAddress: emailAddress,
    });

    console.log(` Updated Reservation: ${updatedReservation}`);
    await Reservation.updateOne({ _id: id }, updatedReservation);

    res.redirect("/reservation-list");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});
export default router;
