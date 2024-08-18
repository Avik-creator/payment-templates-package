// Import the jsonwebtoken library and necessary types
import jwt from "jsonwebtoken";
import { Response } from "express";

// Define a function that generates a JWT and sets it as a cookie
export const generateTokenAndSetCookie = (
  userId: string,
  res: Response
): void => {
  // Use the jsonwebtoken library to sign a JWT with the user ID and a secret key
  // Set the expiration time of the token to 15 days
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "15d",
  });

  // Set the JWT as a cookie on the response object
  // Set the max age of the cookie to 15 days
  // Set the cookie to be HTTP only to prevent XSS attacks
  // Set the same site attribute to strict to prevent CSRF attacks
  // Set the secure attribute to true if the environment is not development
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });
};
