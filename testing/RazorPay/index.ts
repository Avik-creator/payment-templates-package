import express, { Application } from "express";
import dotenv from "dotenv";
import razorpayRoute from "./routes/RazorPayRoute";
import authRoute from "./routes/AuthRoute";
import connectMongoDB from "./config/connectMongoDB";
import cookieParser from "cookie-parser";

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT as string, 10);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/stripe", razorpayRoute);
app.use("/api/auth", authRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectMongoDB();
});
