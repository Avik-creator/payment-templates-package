// Import the User model, jwt package, and necessary types
import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Extend the Express Request type to include the user and cookies properties
interface AuthenticatedRequest extends Request {
  user?: IUser;
  cookies: {
    jwt?: string;
  };
}

// protectRoute middleware function to protect routes that require authentication
export const protectRoute = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get the JWT token from cookies
    const token = req.cookies.jwt;

    // If no token is provided, return an Unauthorized error
    if (!token) {
      res.status(401).json({ error: "Unauthorized: No Token Provided" });
      return;
    }

    // Verify the token using the JWT_SECRET environment variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    // If the token is invalid, jwt.verify will throw an error, so we don't need to check !decoded

    // Find the user in the database using the decoded userId
    const user = await User.findById(decoded.userId).select("-password");

    // If the user is not found, return a User not found error
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Attach the user object to the request object
    req.user = user;

    // Call the next middleware function
    next();
  } catch (err) {
    // Log the error message
    console.log("Error in protectRoute middleware", (err as Error).message);

    // Check if the error is due to an invalid token
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Unauthorized: Invalid Token" });
    } else {
      // Return an Internal Server Error for other types of errors
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
