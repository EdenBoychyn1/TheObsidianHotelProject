import express from "express";
const router = express.Router();

import Reservation from "../Models/reservation";

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

/* GET Reservation Edit page */
router.get("/reservation-edit", function (req, res, next) {
  res.render("index", {
    title: "Edit Reservation",
    page: "reservation-edit",
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
    console.log(`Reservation List ${reservationsCollection}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error"); // Handle the error gracefully
  }
});

/* GET Reservation List page */
// // router.get("/reservation-list", function (req, res, next) {
// //   Reservation.find(function (err: any, reservations: any) {
// //     if (err) {
// //       console.log(
// //         "Encountered an Error reading from the database: " + err.message
// //       );
// //     }

// //     console.log(reservations);
// //   });

//   res.render("index", {
//     title: "Reservation List",
//     page: "reservation-list",
//   });
// });
export default router;
