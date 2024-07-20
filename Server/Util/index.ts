import express, { Request, Response, NextFunction } from "express";
import { UserDocument } from "../Models/user";

// convenience function to return the DisplayName of the user
export function UserSecurityLevel(req: Request): string {
  if (req.user) {
    let user = req.user as UserDocument;
    return user.userType.toString();
  }
  return "";
}

export function FindEmailAddress(req: Request): string {
  if (req.user) {
    let user = req.user as UserDocument;
    return user.EmailAddress.toString();
  } else {
    return "";
  }
}

export function StreetNumber(req: Request): string {
  let address = req.body.inputAddress.split(" ");

  let streetNumber;

  if (address != null) {
    streetNumber = address[0];
  }
  return streetNumber;
}

export function StreetName(req: Request): string {
  let address = req.body.inputAddress.split(" ");

  let streetName;

  if (address != null) {
    streetName = address[1];

    for (let i = 2; i < address.length; i++) {
      streetName += " " + address[i];
    }
  }
  return streetName;
}

// custom authentication guard middleware
export function AuthGuard(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
}
