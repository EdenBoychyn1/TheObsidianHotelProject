import createErrorfrom, { HttpError } from "http-errors";
import express, { NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "express-session";
import mongoose from "mongoose";

import indexRouter from "../Routes/index";
import usersRouter from "../Routes/users";
import createHttpError from "http-errors";

// Configure session middleware
// Define a custom interface extending express-session's Session interface

const app = express();

// db configuration
// Find the DB Config file
import * as DBConfig from "./db";

// Connect to the NoSQL DB by using the connection method and inputting the LocalURI string
mongoose.connect(DBConfig.LocalURI);
//Alias for mongoose connection
const db = mongoose.connection; //
db.on("error", function () {
  console.error("Connection Error!");
});
db.once("open", function () {
  console.log(`Connection to MongoDB at ${DBConfig.HostName}`);
});

// Use express-session middleware with custom session interface
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

console.log(`Directory Name --> ${__dirname}`);
console.log(`File Name --> ${__filename}`);
// view engine setup
app.set("views", path.join(__dirname, "../Views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../Client")));

app.use(express.static(path.join(__dirname, "../node_modules")));
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
