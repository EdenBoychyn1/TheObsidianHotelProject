import createHttpError from "http-errors";
import express, { NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

// Module to connect to MongoDB
import mongoose from "mongoose";

// Modules to support authentication
import session from "express-session"; // cookie-based session
import passport from "passport"; // authentication support
import passportLocal from "passport-local"; // authentication strategy (username/password)
import { Strategy as LocalStrategy } from "passport-local";
import flash from "connect-flash"; // authentication messaging

// Authentication Model and Strategy Alias
let localStrategy = passportLocal.Strategy; // Alias

// User Model
import { User, Guest } from "../Models/user";
// import Guest from "../Models/guest";

// App Configuration
import indexRouter from "../Routes/index";
import usersRouter from "../Routes/users";

// Configure session middleware
// Define a custom interface extending express-session's Session interface

const app = express();

// DB Configuration
// Find the DB Config file
import * as DBConfig from "./db";

// Connect to the NoSQL DB by using the connection method and inputting the LocalURI string
mongoose.connect(DBConfig.RemoteURI);
//Alias for mongoose connection
const db = mongoose.connection; //
db.on("error", function () {
  console.error(`Connection Error! ${DBConfig.RemoteURI}`);
});
db.once("open", function () {
  console.log(`Connection to MongoDB at ${DBConfig.HostName}`);
});

//Use express-session middleware with custom session interface
app.use(
  session({
    secret: DBConfig.SessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

console.log(`Directory Name --> ${__dirname}`);
console.log(`File Name --> ${__filename}`);

// view engine setup
app.set("views", path.join(__dirname, "../Views"));
app.set("view engine", "ejs");

// Middleware configuration
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../../Client")));
app.use(express.static(path.join(__dirname, "../../node_modules")));

app.use(flash());

// Initalize Passport
// Configure this before the route configuration so the login/logout can be processed
app.use(passport.initialize());
app.use(passport.session());

//Implement an Auth Strategy
passport.use(User.createStrategy());

/*********************Line 85 was adapted by Eden Boychyn from Tom Tsiliopoulos***********************/
//Seralize and Deserialize our data
passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req: express.Request, res: express.Response, next: Function) {
  next(createError(404));
});

// error handler
app.use(function (
  err: createHttpError.HttpError,
  req: express.Request,
  res: express.Response,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
function createError(arg0: number): any {
  throw new Error("Function not implemented.");
}
