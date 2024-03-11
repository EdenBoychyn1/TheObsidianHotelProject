import express from "express";
const router = express.Router();

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
  res.render("index", { title: "Login", page: "login" });
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

/* GET Reservation List page */
router.get("/reservation-list", function (req, res, next) {
  res.render("index", {
    title: "Reservation List",
    page: "reservation-list",
  });
});
export default router;
