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

/* Display the EditPage */
/* Display the Edit Page with Data injected from the db */
// router.get("/reservation-edit/:id", async (req, res, next) => {
//   let id = req.params.id;
//   try {
//     const reservationToEdit = await Reservation.findById(id).exec();
//     console.log(reservationToEdit);
//     res.render("index", {
//       title: "Edit",
//       page: "reservation-edit",
//       reservation: reservationToEdit,
//       displayName: "",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error); // Handle the error gracefully
//   }
//   // pass the id to the db and read the contact in
// });

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

/* Process the Add Request */
/* GET Reservation page */
// router.post("/reservation-edit:id", async (req, res, next) => {
//   // Instantiate a new reservation
//   let id = req.params.id;

//   let combinedData: any; // Define a variable to store the combined data
//   try {
//     const result = await Reservation.aggregate([
//       {
//         $match: { _id: id }, // Match the reservation by EmailAddress
//       },
//       {
//         $lookup: {
//           from: "guests", // The collection you're looking up into (Guest collection)
//           localField: "EmailAddress", // Field from Reservation collection
//           foreignField: "EmailAddress", // Field from Guest collection
//           as: "guest", // Alias for the joined documents
//         },
//       },
//       {
//         $unwind: "$guest", // Deconstruct the guest array created by $lookup
//       },
//       {
//         $project: {
//           _id: 1, // Include Reservation _id
//           ReservationID: 1,
//           ReservationStartDate: 1,
//           ReservationEndDate: 1,
//           NumberOfGuests: 1,
//           RoomNumber: 1,
//           BillingUnitNumber: 1,
//           BillingStreetNumber: 1,
//           BillingStreetName: 1,
//           BillingCity: 1,
//           BillingProvince: 1,
//           BillingCountry: 1,
//           BillingPostalCode: 1,
//           DateCreated: 1,
//           LastUpdate: 1,
//           EmailAddress: 1,
//           guest: {
//             FirstName: 1, // Include Guest fields
//             LastName: 1,
//             UserName: 1,
//             SecurityLevel: 1,
//             UnitNumber: 1,
//             StreetNumber: 1,
//             StreetName: 1,
//             City: 1,
//             Province: 1,
//             Country: 1,
//             PostalCode: 1,
//             DateCreated: 1,
//             LastUpdate: 1,
//           },
//         },
//       },
//     ]).exec();

//     // if (!result || result.length === 0) {
//     //   res
//     //     .status(404)
//     //     .json({ error: "No reservation found for the provided email address" });
//     // }

//     combinedData = result[0]; // Store the combined data in the variable
//     console.log(`Combined Data: ${combinedData}`);
//     return res.render("index", {
//       title: "Edit",
//       page: "reservation-edit",
//       reservation: combinedData,
//       displayName: "",
//     });

//     // Now you can use `combinedData` for further processing or return it as needed
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });

export default router;
