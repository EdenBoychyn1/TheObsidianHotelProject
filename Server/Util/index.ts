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
