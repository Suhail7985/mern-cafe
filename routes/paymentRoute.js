import express from "express";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";

const Router = express.Router();

Router.post("/razorpay/order", createOrder);
Router.post("/razorpay/verify", verifyPayment);

export default Router;


