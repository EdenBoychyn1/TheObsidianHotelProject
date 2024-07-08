/*
 * Importing the Express Module.
 */
import express from "express";

/**
 * Declaring and initalizing the router variable that holds the express router object.
 */
const router = express.Router();

/*
 * Import the Reservation, Room, User, and Guest Models.
 */
import Reservation from "../Models/reservation";
import Room from "../Models/room";
import { User, Guest } from "../Models/user";
import mongoose from "mongoose";

/*
 * Import the Passport module and Utility folder I created.
 */
import passport from "passport";
import { FindEmailAddress, UserSecurityLevel } from "../Util";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Home",
    page: "home",
    userType: UserSecurityLevel(req), // Gets the SecurityLevel of the user; is the user a guest or front desk agent?
    emailaddress: FindEmailAddress(req), // Finds the user's email address
  });
});

/* GET Rooms page */
router.get("/rooms", function (req, res, next) {
  res.render("index", {
    title: "Room",
    page: "rooms",
    userType: UserSecurityLevel(req), // Gets the SecurityLevel of the user; is the user a guest or front desk agent?
    emailaddress: FindEmailAddress(req), // Finds the user's email address
  });
});

/* GET Reservation page */
router.get("/reservation", function (req, res, next) {
  res.render("index", {
    title: "Reservations",
    page: "reservation",
    userType: UserSecurityLevel(req), // Gets the SecurityLevel of the user; is the user a guest or front desk agent?
    emailaddress: FindEmailAddress(req), // Finds the user's email address
    messages: req.flash("registerMessage"), // If there is a an issue with making the reservation the flash message will render on the page
  });
});

/* GET gallery page */
router.get("/gallery", function (req, res, next) {
  res.render("index", {
    title: "Gallery",
    page: "gallery",
    userType: UserSecurityLevel(req), // Gets the SecurityLevel of the user; is the user a guest or front desk agent?
    emailaddress: FindEmailAddress(req), // Finds the user's email address
  });
});

/* GET login page */
router.get("/login", function (req, res, next) {
  res.render("index", {
    title: "Login", // Find the title of the page; which in this case is "Login"
    page: "login", // Renders the login page from finding the title.
    userType: "", // userType is left blank because at this point the user is not logged in
    messages: req.flash("loginMessage"), // Flash Message if there is an error when the user attempts to login
    emailaddress: "", // emailAddress is left blank because at this point the user is not logged in
  });
});

/* POST Login Page */
router.post("/login", function (req, res, next) {
  /**
   * The passport authenticate method uses a local strategy which retrieves the username and password that the user created upon registration.
   * The passport authenticate calls the passport.use function which takes the username, passowerd and "done" callback function. The User.findOne method
   * determines if it can find the user, if there is an error it calls the "done" callback function and returns false in regards to finding the user.
   * If it finds the user but cannot verify the password the passport.use function returns false and does not allow the user to login.
   */
  passport.authenticate("local", function (err: any, user: any, info: any) {
    /* If there is an error returned, console log the error, and server will return a response of what the error is. */
    if (err) {
      console.error(err);
      res.end(err);
    }

    /* If there isn't a user found, console log the server response, invoke the flash message, return the user to the login page with the returned flash message. */
    if (!user) {
      console.log(`user ${user}`);
      req.flash("loginMessage", "Authentication Error");
      return res.redirect("/login");
    }

    /* If there is an error returned, console log the error, and server will return a response of what the error is. */
    req.logIn(user, function (err) {
      if (err) {
        console.error(err);
        res.end(err);
      }

      /* If the user has successfully entered their login credentials, find the type of user they are. Redirect the user to the home page upon successful login. */
      const userType = user.userType;
      return res.redirect("/");
    });
  })(req, res, next);
});

/* GET logout page */
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    return res.redirect("/login");
  });
});

/* GET Employee Register page */
router.get("/employee-register", function (req, res, next) {
  /* If there is a user then render the Employee Registration page */
  if (req.user) {
    res.render("index", {
      title: "Employee Registration", // Find the title of the page;
      page: "employee-register", // Renders the employee-registration page from finding the title
      userType: UserSecurityLevel(req), // userType is determined because at this point the user is logged in
      messages: req.flash("registerMessage"), // Flash Message if there is an error when the user register an employee
      emailaddress: FindEmailAddress(req), // emailAddress is returned of the employee that is logged in
    });
  }
  return res.redirect("/");
});

/* POST Employee register page */
router.post(
  "/employee-register",
  function (
    req: express.Request /*********************Line 128 was modified from Tom Tsiliopoulos***********************/,
    res: express.Response /*********************Line 129 was modified from Tom Tsiliopoulos***********************/,
    next: express.NextFunction /*********************Line 130 was modified from Tom Tsiliopoulos***********************/
  ) {
    /* Instantiating a new User from the User Mongoose Schema
     * Dinitalizing all the fields in the User Mongoose Schema
     */
    let newEmployee = new User({
      FirstName: req.body.firstName,
      LastName: req.body.lastName,
      username: req.body.emailAddress,
      SecurityLevel: "FrontDeskAgent",
      EmailAddress: req.body.emailAddress,
      userType: "employee",
    });

    User.register(newEmployee, req.body.password, function (err: any) {
      if (err) {
        /*
         * If the username already exists, then return the UserExistsError.
         * Server response will return an error in the form of a flash message.
         */
        if (err.name == "UserExistsError") {
          /*********************Line 144 was modified from Tom Tsiliopoulos; he added "Error" to the end of UserExistsError***********************/
          console.error("ERROR: User already exists!\n");
          req.flash("registerMessage", "ERROR: this Employee already exists!");
        } else if (err.name == "MissingUsernameError") {
          /*
           * If the username textbox is empty, then return the MissingUsernameError.
           * Server response will return an error in the form of a flash message.
           */
          console.error("ERROR: User must enter an email address!\n");
          req.flash(
            "registerMessage",
            "ERROR: You must enter an email address for the employee!"
          );
        } else if (err.name == "MissingPasswordError") {
          /*
           * If the password textbox is empty, then return the MissingPasswordError.
           * Server response will return an error in the form of a flash message.
           */
          console.error("ERROR: User must enter a password!\n");
          req.flash(
            "registerMessage",
            "ERROR: You must enter a temporary password for the employee!"
          );
        } else {
          /*************************************Line 160 was added by Tom Tsiliopoulos; just the "else" clause*********************/
          /*
           * If the form was left blank then Missing Information will message in the form of a flash message will be displayed.
           */
          console.error(err.name); // Other error
          req.flash(
            "registerMessage",
            "Server Error: Missing or incorrect information."
          );
        }

        return res.redirect(
          "/employee-register"
        ); /*************************************Line 169 was added by Tom Tsiliopoulos*********************/
      }

      return res.redirect("/reservation-list");
    });
  }
);

/* GET Guest Register page */
router.get("/register", function (req, res, next) {
  res.render("index", {
    title: "Guest Registration ", // Find the title of the page;
    page: "register", // Renders the register page from finding the title
    userType: UserSecurityLevel(req), // userType is left blank because at this point the user is not logged in
    messages: req.flash("registerMessage"), // Flash Message if there is an error when the user register as a guest
    emailaddress: FindEmailAddress(req), // emailAddress is returned of the guest when they logged in
  });
});

/* POST Guest-register page */
router.post("/register", async (req, res, next) => {
  {
    try {
      /*
       * Return the address, and split the address to return the street number, and street name,
       */
      let address = req.body.inputAddress;
      let addressSplit = address.split(" ");
      let streetNumber = addressSplit[0];
      let streetName = addressSplit[1];

      for (let i = 2; i < addressSplit.length; i++) {
        streetName += " " + addressSplit[i];
      }

      // Instantiate a new user object
      // We have to do this because we do not have access to the user model
      /*
       * Initialize all the properties of the Guest userType from the inout fields of the form
       */
      let newGuest = new Guest({
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

      /*
       * Register the User with the User.Register method that takes the instantiated and initalized NewGuest object and inputs the new user into the Users
       * collection.
       */
      User.register(newGuest, req.body.password, function (err: any) {
        if (err) {
          if (err.name == "UserExistsError") {
            /*
             * If the username already exists, then return the UserExistsError.
             * Server response will return an error in the form of a flash message.
             */
            console.error("ERROR: Guest already exists!\n");
            req.flash(
              "registerMessage",
              "ERROR: this Employee already exists!"
            );
          } else if (err.name == "MissingUsernameError") {
            /*
             * If the email address textbox is empty, then return the MissingUsernameError.
             * Server response will return an error in the form of a flash message.
             * The email address becomes the username.
             */
            console.error("ERROR: User must enter an email address!\n");
            req.flash(
              "registerMessage",
              "ERROR: You must enter an email address for the guests!"
            );
          } else if (err.name == "MissingPasswordError") {
            /*
             * If the password textbox is empty, then return the MissingPasswordError.
             * Server response will return an error in the form of a flash message.
             */
            console.error("ERROR: User must enter a password!\n");
            req.flash("registerMessage", "ERROR: You must enter a password!");
          } else {
            /*
             * If the form was left blank then Missing Information will message in the form of a flash message will be displayed.
             */
            console.error(err.name); // Other error
            req.flash(
              "registerMessage",
              "Server Error: Missing or incorrect information."
            );
          }

          return res.redirect("/register");
        }

        /*
         * If the user has successfully registered their account then they will be re-directed to the Home page.
         */
        return res.render("index", {
          title: "Home",
          page: "home",
          userType: UserSecurityLevel(req),
          emailaddress: FindEmailAddress(req),
        });
      });
    } catch (error) {
      /*
       * If there is any other issue with registering the user an error will be returned.
       */
      console.error("Error registering guest:", error);
      req.flash("registerMessage", "Server Error");
      return res.redirect("/register");
    }
  }
});

/* Get the Reservation-list page */
router.get("/reservation-list", async (req, res, next) => {
  try {
    /* If there is a user logged in then display the reservation list */
    /* TODO: Need to ensure that it is only of user type FrontDeskAgent */
    if (req.user) {
      const reservationsCollection = await Reservation.find({}).exec();

      // Render the page with the reservations data
      res.render("index", {
        title: "Reservation List", // Find the title of the page;
        page: "reservation-list", // Renders the reservation-list page from finding the title
        userType: UserSecurityLevel(req), // userType is determined because at this point the user is logged in
        reservations: reservationsCollection, // Returns the reservations collection
        emailaddress: FindEmailAddress(req),
      });
    } else {
      return res.redirect("/");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  } // emailAddress is returned of the employee when they logged in
});

/* Get guest reservation(s) page */
router.get("/guest-reservation", async (req, res, next) => {
  try {
    /* If user is of usertype Guest retyurn all the reservations that specific guest has. */
    if (req.user) {
      const reservationsCollection = await Reservation.find({
        EmailAddress: FindEmailAddress(req),
      }).exec();

      // Render the page with the reservations data
      res.render("index", {
        title: "Your Reservations", // Find the title of the page;
        page: "guest-reservation", // Renders the guest-reservation page from finding the title
        userType: UserSecurityLevel(req), // userType is determined because at this point the user is logged in
        reservations: reservationsCollection, // Returns the reservations collection
        emailaddress: FindEmailAddress(req), // emailAddress is returned of the guest when they logged in
      });
    } else {
      return res.redirect("/");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error"); // Handle the error gracefully
  }
});

/* Get the Reservation-add Page */
router.get("/reservation-add", function (req, res, next) {
  res.render("index", {
    title: "Add", // Find the title of the page;
    page: "reservation-add", // Renders the reservation-add page from finding the title
    reservation: "", // Quotations are added so that an initialized variable error is not thrown.
    userType: UserSecurityLevel(req), // userType is determined because at this point the user is logged in
    emailaddress: FindEmailAddress(req), // emailAddress is returned of the guest when they logged in
    messages: req.flash("registerMessage"), // If there is an error in creating the reservation a flash message will display on the page.
  });
});

/* POST the reservation page*/
router.post("/reservation", async function (req, res, next) {
  try {
    /* Declare and initialize variables and store the forms input into the designated variables */
    let UserType = UserSecurityLevel(req);
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

    /* Validation check to determine if any of the variables have a null value */
    if (
      firstName === "" ||
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
      address === ""
    ) {
      req.flash("registerMessage", "ERROR: Missing or incorrect information.");
      return res.redirect("/reservation");
    } else if (
      /* If the reservation start date is greater than the reservation end date and vice versa, display a flash error message */
      reservationStartDate >= reservationEndDate ||
      reservationEndDate <= reservationStartDate
    ) {
      req.flash(
        "registerMessage",
        "ERROR: Check In Date cannot be later than Check Out Date and Check Out Date cannot be earlier than Check In Date."
      );
      return res.redirect("/reservation");
    } else {
      /**
       *  Looping through the roomCollection array which found all the rooms within a specific room type
       */
      for (let index = 0; index < roomCollection.length; index++) {
        console.log(`Room Number: ${roomCollection[index].RoomNumber}`);

        /*
         * Loop through the roomCollection array and for every room store it in the reservation variable.
         */
        const reservation = await Reservation.find({
          RoomNumber: roomCollection[index].RoomNumber,
        });

        /*
         * Assume that there is not a conflictFound
         */
        let conflictFound = false;
        for (let i = 0; i < reservation.length; i++) {
          /* If the proposed reservation start date matches the another already made reservation start date or end date or any date in between; it will throw an error
           * If the proposed start and end date of the reservation does not match any room thta has the same room type, it will assign a room to the reservation.*/
          const existingReservation = reservation[i];
          console.log(
            `Reservation Start Date: ${existingReservation.ReservationStartDate}`
          );

          if (
            (reservationStartDate >= existingReservation.ReservationStartDate &&
              reservationStartDate < existingReservation.ReservationEndDate) ||
            (reservationEndDate > existingReservation.ReservationStartDate &&
              reservationEndDate <= existingReservation.ReservationEndDate) ||
            (reservationStartDate <= existingReservation.ReservationStartDate &&
              reservationEndDate >= existingReservation.ReservationEndDate)
          ) {
            console.log("Conflict found!");
            conflictFound = true;
            break; // Exit the loop if conflict found
          }
        }

        /* If there is no reservation conflict found; create the reservation. */
        if (conflictFound === false) {
          let newReservation = new Reservation({
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

          // Save the new reservation
          await newReservation.save();

          if (UserType === "employee") {
            return res.redirect("/reservation-list");
          } else if (UserType === "guest") {
            return res.redirect("/guest-reservation");
          }
        } else if (conflictFound === true) {
          req.flash(
            "registerMessage",
            "ERROR: No rooms for the room type selected are available for the dates that you have entered."
          );
          return res.redirect("/reservation");
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

/* POST the reservation-add page */
router.post("/reservation-add", async function (req, res, next) {
  try {
    /* Declare and initialize variables and store the forms input into the designated variables */
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

    /* Validation check to determine if any of the variables have a null value */
    if (
      firstName === "" ||
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
      address === ""
    ) {
      req.flash("registerMessage", "ERROR: Missing or incorrect information.");
      return res.redirect("/reservation");
    } else if (
      /* If the reservation start date is greater than the reservation end date and vice versa, display a flash error message */
      reservationStartDate >= reservationEndDate ||
      reservationEndDate <= reservationStartDate
    ) {
      req.flash(
        "registerMessage",
        "ERROR: Check In Date cannot be later than Check Out Date and Check Out Date cannot be earlier than Check In Date."
      );
      return res.redirect("/reservation");
    } else {
      /**
       *  Looping through the roomCollection array which found all the rooms within a specific room type
       */
      for (let index = 0; index < roomCollection.length; index++) {
        console.log(`Room Number: ${roomCollection[index].RoomNumber}`);

        const reservation = await Reservation.find({
          RoomNumber: roomCollection[index].RoomNumber,
        });

        /*
         * Assume that there is not a conflictFound
         */
        let conflictFound = false;
        for (let i = 0; i < reservation.length; i++) {
          const existingReservation = reservation[i];
          console.log(
            `Reservation Start Date: ${existingReservation.ReservationStartDate}`
          );
          /* If the proposed reservation start date matches the another already made reservation start date or end date or any date in between; it will throw an error
           * If the proposed start and end date of the reservation does not match any room thta has the same room type, it will assign a room to the reservation.*/
          if (
            (reservationStartDate >= existingReservation.ReservationStartDate &&
              reservationStartDate < existingReservation.ReservationEndDate) ||
            (reservationEndDate > existingReservation.ReservationStartDate &&
              reservationEndDate <= existingReservation.ReservationEndDate) ||
            (reservationStartDate <= existingReservation.ReservationStartDate &&
              reservationEndDate >= existingReservation.ReservationEndDate)
          ) {
            console.log("Conflict found!");
            conflictFound = true;
            break; // Exit the loop if conflict found
          }
        }

        /* If there is no reservation conflict found; create the reservation. */
        if (conflictFound === false) {
          let newReservation = new Reservation({
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

          // Save the new reservation
          await newReservation.save();
          return res.redirect("/reservation-list");
        } else if (conflictFound === true) {
          req.flash(
            "registerMessage",
            "No rooms for the room type selected are available for the dates that you have entered."
          );
          return res.redirect("/reservation-add");
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

/* GET request to check the guest in */
router.get("/check-in/:ReservationID", async function (req, res, next) {
  try {
    /*
     * Find the reservation ID from the reservation-list
     */
    let reservationId = req.params.ReservationID;

    /*
     * Define a variable to store the combined data
     * Find the reservation based on the reservation parameters (in this case reservationID) and update that reservation's room status to
     * checked-in.
     */
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

/* GET request to check the guest out */
router.get("/check-out/:ReservationID", async function (req, res, next) {
  try {
    /*
     * Find the reservation ID from the reservation-list
     */
    let reservationId = req.params.ReservationID;

    /*
     * Define a variable to store the combined data
     * Find the reservation based on the reservation parameters (in this case reservationID) and update that reservation's room status to
     * checked-in.
     */
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

/* GET request to delete the specific reservation */
router.get("/delete/:EmailAddress", async function (req, res, next) {
  try {
    let UserType = UserSecurityLevel(req);
    let emailAddress = req.params.EmailAddress;

    /*
     * Declare and initalize the emailAddress variable and store the email address from the parameters of the get request into this variable.
     */
    await Reservation.deleteOne({ EmailAddress: emailAddress });

    /**
     * Store the userType variable from finding the type of user.
     * If the user type is employee redirect the employee to the reservation list page.
     * If the user is a guest cancelling their own reservation, redirect the guest back to their own reservation list.
     */
    if (UserType === "employee") {
      res.redirect("/reservation-list");
    } else if (UserType === "guest") {
      res.redirect("/guest-reservation");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

/* GET request to edit a reservation */
router.get("/reservation-edit/:EmailAddress", async (req, res, next) => {
  try {
    /*
     * If there is a logged in session of the user; initalize the email address variable with the email address of the user from the get request
     */
    if (req.user) {
      let emailAddress = req.params.EmailAddress;

      //TODO: Might be an issue later.
      /**
       * Find the reservation by matching the email address field with the email address variable.
       * Join the guest table and the reservation table with the matching email address (email address is being used as a foreign key).
       */
      const reservation: any = await Reservation.aggregate([
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

      /*
       * Once there is a match render the reservation-edit page.
       */
      return res.render("index", {
        title: "Edit", // Find the title of the page;
        page: "reservation-edit", // Renders the reservation-add page from finding the title
        reservation: reservation, // Returns the reservation at the index
        userType: UserSecurityLevel(req), // userType is determined because at this point the user is logged in
        emailaddress: FindEmailAddress(req), // emailAddress is returned of the guest when they logged in
        messages: req.flash("registerMessage"), // If there is an error in updating the reservation a flash message will display on the page.
      });
    } else {
      return res.redirect("/login");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/* POST request to update the reservation */
router.post("/reservation-edit/:EmailAddress", async (req, res, next) => {
  /* Instantiate a new contact to edit */
  try {
    /**
     * Declare and initialize variables and store the forms input into the designated variables
     */
    let UserType = UserSecurityLevel(req);

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

    /*
     * Find the reservation in the database using the email address attached to the reservation.
     * Update the reservation based on the new criteria specified in the reservation.
     */
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
          BillingCountry: billingCountry,
          BillingPostalCode: billingPostalCode,
          roomType: roomType,
          NumberOfGuests: numberOfGuests,
        },
      }
    ).exec();
    console.log(`Billing Province ${updatedReservation?.BillingProvince}`);

    /**
     * Store the userType variable from finding the type of user.
     * If the user type is employee redirect the employee to the reservation list page.
     * If the user is a guest cancelling their own reservation, redirect the guest back to their own reservation list.
     */
    if (UserType === "employee") {
      res.redirect("/reservation-list");
    } else if (UserType === "guest") {
      res.redirect("/guest-reservation");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});
export default router;
