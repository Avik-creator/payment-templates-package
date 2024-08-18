// Importing necessary dependencies
import { Request, Response } from "express";
import { generateTokenAndSetCookie } from "../utils/generateToken";
import User, { IUser } from "../models/User";
import bcrypt from "bcryptjs";

// Controller function for user signup
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: "Invalid email format" });
      return;
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ error: "Username is already taken" });
      return;
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.status(400).json({ error: "Email is already taken" });
      return;
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    generateTokenAndSetCookie(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      email: newUser.email,
    });
  } catch (error) {
    console.log("Error in signup controller", (error as Error).message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller function for user login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      res.status(400).json({ error: "Invalid username or password" });
      return;
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      message: "Logged in successfully",
    });
  } catch (error) {
    console.log("Error in login controller", (error as Error).message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller function for user logout
export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", (error as Error).message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller function to get current user details
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById((req.user as IUser)._id).select(
      "-password"
    );
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe controller", (error as Error).message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
